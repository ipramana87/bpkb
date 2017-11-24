<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class PemindahanBPKB extends CI_Controller {

	public function __construct() {
		parent::__construct();
		if ($this->session->userdata('login') <> TRUE) {
			redirect('login');
		}
	}

	public function index() {
		$this->load->view('vpemindahanbpkb');
	}

	public function gridhistory() {
		
	}

	public function griddaftarbpkb() {
		$sCari = trim($this->input->post('fs_cari'));
		$nStart = trim($this->input->post('start'));
		$nLimit = trim($this->input->post('limit'));

		$this->db->trans_start();
		$this->load->model('MSearch');
		$sSQL = $this->MSearch->listBPKBAll($sCari);
		$xTotal = $sSQL->num_rows();
		$sSQL = $this->MSearch->listBPKB($sCari, $nStart, $nLimit);
		$this->db->trans_complete();

		$xArr = array();
		if ($sSQL->num_rows() > 0) {
			foreach ($sSQL->result() as $xRow) {
				$xArr[] = array(
					'fs_no_bpkb' => trim($xRow->fs_no_bpkb)
					
				);
			}
		}
		echo '({"total":"'.$xTotal.'","hasil":'.json_encode($xArr).'})';
	}

	public function gridpenyimpananbpkb(){
		$sCari = trim($this->input->post('fs_cari'));
		$nStart = trim($this->input->post('start'));
		$nLimit = trim($this->input->post('limit'));

		$this->db->trans_start();
		$this->load->model('MSearch');
		$sSQL = $this->MSearch->listPenyimpananAll($sCari);
		$xTotal = $sSQL->num_rows();
		$sSQL = $this->MSearch->listPenyimpanan($sCari, $nStart, $nLimit);
		$this->db->trans_complete();

		$xArr = array();
		if ($sSQL->num_rows() > 0) {
			foreach ($sSQL->result() as $xRow) {
				$xArr[] = array(
					'fs_kode_brangkas' => trim($xRow->fs_kode_brangkas),
					'fs_nama_loker'	=> trim($xRow->fs_nama_loker)
				);
			}
		}
		echo '({"total":"'.$xTotal.'","hasil":'.json_encode($xArr).'})';
	}
}