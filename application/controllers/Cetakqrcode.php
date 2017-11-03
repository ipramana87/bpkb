<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Cetakqrcode extends CI_Controller {

	public function __construct() {
		parent::__construct();
		if ($this->session->userdata('login') <> TRUE) {
			redirect('login');
		}
	}

	public function index() {
		$this->load->view('vcetakqrcode');
	}

	public function gridbpkb() {
		$sCari = trim($this->input->post('fs_cari'));
		$nStart = trim($this->input->post('start'));
		$nLimit = trim($this->input->post('limit'));

		$this->db->trans_start();
		$this->load->model('MCetakQrCode');
		$sSQL = $this->MCetakQrCode->listBPKBAll($sCari);
		$xTotal = $sSQL->num_rows();
		$sSQL = $this->MCetakQrCode->listBPKB($sCari, $nStart, $nLimit);
		$this->db->trans_complete();

		$xArr = array();
		if ($sSQL->num_rows() > 0) {
			foreach ($sSQL->result() as $xRow) {
				$xArr[] = array(
					'fs_no_bpkb' => trim($xRow->fs_no_bpkb),
					'fs_nama_bpkb' => trim($xRow->fs_nama_bpkb),
					'fd_tanggal_bpkb' => trim($xRow->fd_tanggal_bpkb),
					'fs_jenis_kendaraan' => trim($xRow->fs_jenis_kendaraan)
				);
			}
		}
		echo '({"total":"'.$xTotal.'","hasil":'.json_encode($xArr).'})';

	}

	public function preview() {
		$bpkb = $this->input->post('fs_no_bpkb');

		$this->load->library('ciqrcode');
		$filename = str_replace(' ', '-', $bpkb);

		$params['data'] = trim($bpkb);
		$params['savename'] = FCPATH . "uploads/qrcode/".trim($filename).'.png';
		$file = $this->ciqrcode->generate($params);

		$pathfile = base_url('/uploads/qrcode/'. $filename . '.png');
		$hasil = array(
			'src' => $pathfile
		);
		echo json_encode($hasil);
	}

	public function cekprint() {
		$check = $this->input->post('fs_add');
	}

	public function print() {
		$this->load->view('print/vqrcode');
	}

}