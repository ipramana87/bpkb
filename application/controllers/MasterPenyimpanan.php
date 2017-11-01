<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class MasterPenyimpanan extends CI_Controller {

	public function __construct() {
		parent::__construct();
		if ($this->session->userdata('login') <> TRUE) {
			redirect('login');
		}
	}

	public function index() {
		$this->load->view('vmasterpenyimpanan');
	}
	public function grid() {
		$sCari = trim($this->input->post('fs_cari'));
		$nStart = trim($this->input->post('start'));
		$nLimit = trim($this->input->post('limit'));

		$this->db->trans_start();
		$this->load->model('MMasterPenyimpanan');
		$sSQL = $this->MMasterPenyimpanan->listPenyimpananAll($sCari);
		$xTotal = $sSQL->num_rows();
		$sSQL = $this->MMasterPenyimpanan->listPenyimpan($sCari, $nStart, $nLimit);
		$this->db->trans_complete();

		$xArr = array();
		if ($sSQL->num_rows() > 0) {
			foreach ($sSQL->result() as $xRow) {
				$xArr[] = array(
					'fs_kode_cabang' => trim($xRow->fs_kode_cabang),
					'fs_nama_cabang' => trim($xRow->fs_nama_cabang),
					'fs_kode_brangkas' => trim($xRow->fs_kode_brangkas),
					'fs_nama_brangkas' => trim($xRow->fs_nama_brangkas)
				);
			}
		}
		echo '({"total":"'.$xTotal.'","hasil":'.json_encode($xArr).'})';
	}

	public function gridcabang() {
		$sCari = trim($this->input->post('fs_cari'));
		$nStart = trim($this->input->post('start'));
		$nLimit = trim($this->input->post('limit'));

		$this->db->trans_start();
		$this->load->model('MSearch');
		$sSQL = $this->MSearch->listCabangAll($sCari);
		$xTotal = $sSQL->num_rows();
		$sSQL = $this->MSearch->listCabang($sCari, $nStart, $nLimit);
		$this->db->trans_complete();

		$xArr = array();
		if ($sSQL->num_rows() > 0) {
			foreach ($sSQL->result() as $xRow) {
				$xArr[] = array(
					'fs_kode_cabang' => trim($xRow->fs_kode_cabang),
					'fs_nama_cabang' => trim($xRow->fs_nama_cabang)
				);
			}
		}
		echo '({"total":"'.$xTotal.'","hasil":'.json_encode($xArr).'})';
	}


	public function ceksave() {
		$kode = $this->input->post('fs_kode_brangkas');
		
		if (!empty($kode)) {
			$this->load->model('MMasterPenyimpanan');
			$sSQL = $this->MMasterPenyimpanan->checkPenyimpanan($kode);
			if ($sSQL->num_rows() > 0) {
				$hasil = array(
					'sukses' => true,
					'hasil' => 'Pemeriksa sudah ada, apakah Anda ingin meng-update?'
				);
				echo json_encode($hasil);
			} else {
				$hasil = array(
					'sukses' => true,
					'hasil' => 'Pemeriksa belum ada, apakah Anda ingin tambah baru?'
				);
				echo json_encode($hasil);
			}
		} else {
			$hasil = array(
				'sukses' => false,
				'hasil' => 'Simpan, Gagal! Pemeriksa tidak diketahui'
			);
			echo json_encode($hasil);
		}
	}

	public function save() {
		$user = $this->encryption->decrypt($this->session->userdata('username'));

		$cabang = $this->input->post('fs_kode_cabang');
		$kode = $this->input->post('fs_kode_brangkas');
		$nama = $this->input->post('fs_nama_brangkas');

		$this->load->model('MMasterPenyimpanan');
		$ssql = $this->MMasterPenyimpanan->checkPenyimpanan($kode);
		$update = false;

		if ($ssql->num_rows() > 0) {
			$update = true;
		}

		$dt = array(
			'fs_kode_cabang' => trim($cabang),
			'fs_kode_brangkas' => trim($kode),
			'fs_nama_brangkas' => trim($nama)
		);

		if ($update == false) {
			$dt1 = array(
				'fs_user_buat' => trim($user),
				'fd_tanggal_buat' => date('Y-m-d H:i:s')
			);

			$data = array_merge($dt, $dt1);
			$this->db->insert('tm_penyimpanan_bpkb', $data);

			$hasil = array(
				'sukses' => true,
				'hasil' => 'Tambah Data Kode Pemeriksa '.trim($kode).', Sukses!!'
			);
			echo json_encode($hasil);
		} else {
			$dt2 = array(
				'fs_user_edit' => trim($user),
				'fd_tanggal_edit' => date('Y-m-d H:i:s')
			);

			$data = array_merge($dt, $dt2);
			$where = "fs_kode_cabang = '".trim($cabang)."' AND fs_kode_brangkas = '".trim($kode)."'";
			$this->db->where($where);
			$this->db->update('tm_penyimpanan_bpkb', $data);

			$hasil = array(
				'sukses' => true,
				'hasil' => 'Update Data Kode Pemeriksa '.trim($kode).', Sukses!!'
			);
			echo json_encode($hasil);
		}
	}

	public function remove() {
		$kode = $this->input->post('fs_kode_brangkas');
		$where = "fs_kode_brangkas = '".trim($kode)."'";
		$this->db->where($where);
		$this->db->delete('tm_penyimpanan_bpkb');

		$hasil = array(
				'sukses' => true,
				'hasil' => 'Hapus Data Kode Pemeriksa '.trim($kode).', Sukses!!'
		);
		echo json_encode($hasil);
	}

}