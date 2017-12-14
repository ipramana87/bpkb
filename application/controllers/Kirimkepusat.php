<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Kirimkepusat extends CI_Controller {

	public function __construct() {
		parent::__construct();
		if ($this->session->userdata('login') <> TRUE) {
			redirect('login');
		}
	}

	public function index() {
		$this->load->view('vkirimbpkbkepusat');
	}

	public function gridkirimbpkb() {
		$sCari = trim($this->input->post('fs_cari'));
		$nStart = trim($this->input->post('start'));
		$nLimit = trim($this->input->post('limit'));

		$this->db->trans_start();
		$this->load->model('MKirimKePusat');
		$sSQL = $this->MKirimKePusat->listKirimkAll($sCari);
		$xTotal = $sSQL->num_rows();
		$sSQL = $this->MKirimKePusat->listKirim($sCari, $nStart, $nLimit);
		$this->db->trans_complete();

		$xArr = array();
		if ($sSQL->num_rows() > 0) {
			foreach ($sSQL->result() as $xRow) {
				$xArr[] = array(
					'fs_no_bpkb' => trim($xRow->fs_no_bpkb),
					'fn_no_pjj'	=> trim($xRow->fn_no_pjj),
					'fs_nama_pemilik'	=> trim($xRow->fs_nama_pemilik),
					'fs_nama_bpkb' => trim($xRow->fs_nama_bpkb),
					'fd_tanggal_bpkb' => trim($xRow->fd_tanggal_bpkb),
					'fs_jenis_kendaraan' => trim($xRow->fs_jenis_kendaraan),
					'fn_tahun_kendaraan' => trim($xRow->fn_tahun_kendaraan),
					'fs_warna_kendaraan' => trim($xRow->fs_warna_kendaraan),
					'fs_no_mesin' => trim($xRow->fs_no_mesin),
					'fs_no_rangka' => trim($xRow->fs_no_rangka),
					'fs_no_polisi' => trim($xRow->fs_no_polisi),
					'fs_no_faktur' => trim($xRow->fs_no_faktur),
					'fs_tempat_bpkb' => trim($xRow->fs_tempat_bpkb),
					'fs_nama_loker' => trim($xRow->fs_nama_loker),
					'fd_tanggal_terbit' => trim($xRow->fd_tanggal_terbit),
					'fd_terbit_stnk' => trim($xRow->fd_terbit_stnk)	
				);
			}
		}
		echo '({"total":"'.$xTotal.'","hasil":'.json_encode($xArr).'})';
	}

	public function griddaftar() {

	}

	public function remove() {
		$kode = $this->input->post('fs_no_bpkb');
		$where = "fs_no_bpkb = '".trim($kode)."'";
		$this->db->where($where);
		$this->db->delete('tx_detailbpkb');

		$hasil = array(
				'sukses' => true,
				'hasil' => 'Hapus Data User '.trim($kode).', Sukses!!'
		);
		echo json_encode($hasil);
	}

	public function ceksave() {
		$kode = $this->input->post('fn_no_pjj');
		
		if (!empty($kode)) {
			$this->load->model('MSearch');
			$sSQL = $this->MSearch->checkbpkb($kode);
			if ($sSQL->num_rows() > 0) {
				$hasil = array(
					'sukses' => true,
					'hasil' => 'NO. BPKB sudah ada, apakah Anda ingin meng-update?'
				);
				echo json_encode($hasil);
			} else {
				$hasil = array(
					'sukses' => true,
					'hasil' => 'NO. BPKB belum ada, apakah Anda ingin tambah baru?'
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

		$kode = $this->input->post('fn_no_apk');
		$nopjj = $this->input->post('fn_no_pjj');
		$nama = $this->input->post('fs_nama_konsumen');
		$modelken = $this->input->post('fs_model_kendaraan');
		$tahun = $this->input->post('fn_tahun_kendaraan');
		$warna = $this->input->post('fs_warna_kendaraan');
		$nomesin = $this->input->post('fs_no_mesin');
		$norangka = $this->input->post('fs_no_rangka');
		$noagunan = $this->input->post('fs_no_agunan');
		$nobpkb = $this->input->post('fs_no_bpkb');
		$tglterbit = $this->input->post('fd_tanggal_terbit');
		$tglterima = $this->input->post('fd_terima_bpkb');
		$tglterbitsntk = $this->input->post('fd_terbit_stnk');
		$nofaktur = $this->input->post('fs_no_faktur');
		$tempatbpkb = $this->input->post('fs_tempat_bpkb');
		$loker = $this->input->post('fs_nama_loker');
	/*
		// detail fasilitas
		$tanggal = explode('|', $this->input->post('fd_tanggal_berlaku'));
		$fasilitas = explode('|', $this->input->post('fs_nama_fasilitas'));
		$plafon = explode('|', $this->input->post('fn_plafon'));

		// hapus detail fasilitas
		$where = "fs_kode_kreditur = '".trim($kode)."'";
		$this->db->where($where);
		$this->db->delete('tm_detailkreditur');

		// simpan detail fasilitas
		$jml = count($kode) - 1;
		if ($jml > 0) {
			for($i=1; $i<=$jml; $i++) {
				$data = array(
					'fn_no_apk' => trim($kode),
					'fn_no_pjj' => trim($nopjj[$i]),
					'fs_nama_konsumen' => trim($nama[$i]),
					'fs_user_buat' => trim($user),
					'fd_tanggal_buat' => date('Y-m-d H:i:s')
				);
				$this->db->insert('tx_detailbpkb', $data);
			}
		}
	*/
		$this->load->model('MSearch');
		$ssql = $this->MSearch->checkbpkb($kode);
		$update = false;

		if ($ssql->num_rows() > 0) {
			$update = true;
		}

		$dt = array(
			'fn_no_apk' => trim($kode),
			'fn_no_pjj' => trim($nopjj),
			'fs_nama_konsumen' => trim($nama),
			'fs_model_kendaraan' => trim($modelken),
			'fn_tahun_kendaraan' => trim($tahun),
			'fs_warna_kendaraan' => trim($warna),
			'fs_no_mesin' => trim($nomesin),
			'fs_no_rangka' => trim($norangka),
			'fs_no_agunan' => trim($noagunan),
			'fs_no_bpkb' => trim($nobpkb),
			'fd_tanggal_terbit' => trim($tglterbit),
			'fd_terima_bpkb' => trim($tglterima),
			'fd_terbit_stnk' => trim($tglterbitsntk),
			'fs_no_faktur' => trim($nofaktur),
			'fs_tempat_bpkb' => trim($tempatbpkb),
			'fs_nama_loker' => trim($loker),


		);

		if ($update == false) {
			$dt1 = array(
				'fs_user_buat' => trim($user),
				'fd_tanggal_buat' => date('Y-m-d H:i:s')
			);

			$data = array_merge($dt, $dt1);
			$this->db->insert('tx_detailbpkb', $data);

			$hasil = array(
				'sukses' => true,
				'hasil' => 'Tambah BPKB'.trim($kode).', Sukses!!'
			);
			echo json_encode($hasil);
		} else {
			$dt2 = array(
				'fs_user_edit' => trim($user),
				'fd_tanggal_edit' => date('Y-m-d H:i:s')
			);

			$data = array_merge($dt, $dt2);
			$where = "fn_no_apk = '".trim($kode)."'";
			$this->db->where($where);
			$this->db->update('tx_detailbpkb', $data);

			$hasil = array(
				'sukses' => true,
				'hasil' => 'Update BPKB '.trim($kode).', Sukses!!'
			);
			echo json_encode($hasil);
		}
	}
}
