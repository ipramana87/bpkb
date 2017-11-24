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
					'fs_no_faktur' => trim($xRow->fs_no_faktur)	
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
		$this->db->delete('tx_bpkb');

		$hasil = array(
				'sukses' => true,
				'hasil' => 'Hapus Data User '.trim($kode).', Sukses!!'
		);
		echo json_encode($hasil);
	}
}
