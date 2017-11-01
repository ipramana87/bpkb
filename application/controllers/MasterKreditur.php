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
		$sSQL = $this->MMasterKreditur->listkrediturAll($sCari);
		$xTotal = $sSQL->num_rows();
		$sSQL = $this->MMasterKreditur->listkreditur($sCari, $nStart, $nLimit);
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


		$this->load->model('MMasterKreditur');
		$ssql = $this->MMasterKreditur->checkkreditur($kode);
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
			$where = "fs_kode_kreditur = '".trim($cabang)."' AND fs_kode_kreditur = '".trim($kode)."'";
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