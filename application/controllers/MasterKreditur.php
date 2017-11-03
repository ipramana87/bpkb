<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class MasterKreditur extends CI_Controller {

	public function __construct() {
		parent::__construct();
		if ($this->session->userdata('login') <> TRUE) {
			redirect('login');
		}
	}

	public function index() {
		$this->load->view('vmasterkreditur');
	}

	public function combo() {
		// NON AKTIF
		$array = array(1 => array('1','YA'), 2 => array('0','TIDAK'));
		$out = array_values($array);
		echo json_encode($out);
	}

	public function grid(){
		$sCari = trim($this->input->post('fs_cari'));
		$nStart = trim($this->input->post('start'));
		$nLimit = trim($this->input->post('limit'));

		$this->db->trans_start();
		$this->load->model('MMasterKreditur');
		$sSQL = $this->MMasterKreditur->listKrediturAll($sCari);
		$xTotal = $sSQL->num_rows();
		$sSQL = $this->MMasterKreditur->listKreditur($sCari, $nStart, $nLimit);
		$this->db->trans_complete();		

		$xArr = array();
		if ($sSQL->num_rows() > 0) {
			foreach ($sSQL->result() as $xRow) {
				$xArr[] = array(
					'fs_kode_kreditur' => trim($xRow->fs_kode_kreditur),
					'fs_nama_kreditur' => trim($xRow->fs_nama_kreditur),
					'fs_aktif' => trim($xRow->fs_aktif),

				);
			}
		}
		echo '({"total":"'.$xTotal.'","hasil":'.json_encode($xArr).'})';
	}

	public function gridfasilitas() {
		$nStart = $this->input->post('start');
		$nLimit = $this->input->post('limit');

		$nKreditur = $this->input->post('fs_kode_kreditur');

		$this->db->trans_start();
		$this->load->model('MMasterKreditur');
		$sSQL = $this->MMasterKreditur->listFasilitasAll($nKreditur);
		$xTotal = $sSQL->num_rows();
		$sSQL = $this->MMasterKreditur->listFasilitas($nKreditur, $nStart, $nLimit);
		$this->db->trans_complete();

		$xArr = array();
		if ($sSQL->num_rows() > 0) {
			foreach ($sSQL->result() as $xRow) {
				$xArr[] = array(
					'fd_tanggal_berlaku' => trim($xRow->fd_tanggal_berlaku),
					'fs_nama_fasilitas' => trim($xRow->fs_nama_fasilitas),
					'fn_plafon' => trim($xRow->fn_plafon)
				);
			}
		}
		echo '({"total":"'.$xTotal.'","hasil":'.json_encode($xArr).'})';
	}

	public function ceksave() {
		$kode = $this->input->post('fs_kode_kreditur');
		
		if (!empty($kode)) {
			$this->load->model('MMasterKreditur');
			$sSQL = $this->MMasterKreditur->checkkreditur($kode);
			if ($sSQL->num_rows() > 0) {
				$hasil = array(
					'sukses' => true,
					'hasil' => 'Kreditur sudah ada, apakah Anda ingin meng-update?'
				);
				echo json_encode($hasil);
			} else {
				$hasil = array(
					'sukses' => true,
					'hasil' => 'Kreditur belum ada, apakah Anda ingin tambah baru?'
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

		$kode = $this->input->post('fs_kode_kreditur');
		$nama = $this->input->post('fs_nama_kreditur');
		$aktif = $this->input->post('fs_aktif');

		// detail fasilitas
		$tanggal = explode('|', $this->input->post('fd_tanggal_berlaku'));
		$fasilitas = explode('|', $this->input->post('fs_nama_fasilitas'));
		$plafon = explode('|', $this->input->post('fn_plafon'));

		// hapus detail fasilitas
		$where = "fs_kode_kreditur = '".trim($kode)."'";
		$this->db->where($where);
		$this->db->delete('tm_detailkreditur');

		// simpan detail fasilitas
		$jml = count($tanggal) - 1;
		if ($jml > 0) {
			for($i=1; $i<=$jml; $i++) {
				$data = array(
					'fs_kode_kreditur' => trim($kode),
					'fd_tanggal_berlaku' => trim($tanggal[$i]),
					'fs_nama_fasilitas' => trim($fasilitas[$i]),
					'fn_plafon' => trim($plafon[$i]),
					'fs_user_buat' => trim($user),
					'fd_tanggal_buat' => date('Y-m-d H:i:s')
				);
				$this->db->insert('tm_detailkreditur', $data);
			}
		}

		$this->load->model('MMasterKreditur');
		$ssql = $this->MMasterKreditur->checkKreditur($kode);
		$update = false;

		if ($ssql->num_rows() > 0) {
			$update = true;
		}

		$dt = array(
			'fs_kode_kreditur' => trim($kode),
			'fs_nama_kreditur' => trim($nama),
			'fs_aktif' => trim($aktif),
		);

		if ($update == false) {
			$dt1 = array(
				'fs_user_buat' => trim($user),
				'fd_tanggal_buat' => date('Y-m-d H:i:s')
			);

			$data = array_merge($dt, $dt1);
			$this->db->insert('tm_kreditur', $data);

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
			$where = "fs_kode_kreditur = '".trim($kode)."'";
			$this->db->where($where);
			$this->db->update('tm_kreditur', $data);

			$hasil = array(
				'sukses' => true,
				'hasil' => 'Update Data Kode Kreditur '.trim($kode).', Sukses!!'
			);
			echo json_encode($hasil);
		}
	}

	public function remove() {
		$kode = $this->input->post('fs_kode_kreditur');
		$where = "fs_kode_kreditur = '".trim($kode)."'";
		$this->db->where($where);
		$this->db->delete('tm_kreditur');

		$hasil = array(
				'sukses' => true,
				'hasil' => 'Hapus Data Kode Pemeriksa '.trim($kode).', Sukses!!'
		);
		echo json_encode($hasil);
	}
}