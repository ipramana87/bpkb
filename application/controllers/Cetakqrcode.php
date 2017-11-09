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
					'fs_jenis_kendaraan' => trim($xRow->fs_jenis_kendaraan),
					'fn_tahun_kendaraan' => trim($xRow->fn_tahun_kendaraan),
					'fs_warna_kendaraan' => trim($xRow->fs_warna_kendaraan),
					'fs_no_mesin' => trim($xRow->fs_no_mesin),
					'fs_no_rangka' => trim($xRow->fs_no_rangka)	
				);
			}
		}
		echo '({"total":"'.$xTotal.'","hasil":'.json_encode($xArr).'})';

	}

	public function preview() {
		$bpkb = $this->input->post('fs_no_bpkb');

		$this->load->library('ciqrcode');
		$filename = str_replace(' ', '-', $bpkb);
		$path = FCPATH . "uploads/qrcode/".trim($filename).'.png';
		
		if (!file_exists($path)) {
			$params['data'] = trim($bpkb);
			$params['savename'] = FCPATH . "uploads/qrcode/".trim($filename).'.png';
			$file = $this->ciqrcode->generate($params);
		}

		$pathfile = base_url('/uploads/qrcode/'. $filename . '.png');
		$hasil = array(
			'src' => $pathfile
		);
		echo json_encode($hasil);
	}
  
	public function printqrcode() {
		$this->load->library('Pdf');
		$this->load->model('MCetakQrCode');

		$nobpkb = explode('|', trim($this->input->post('fs_no_bpkb')));
		$jml = count($nobpkb) - 1;

		if ($jml > 0) {
			$data['result9']  = $this->MCetakQrCode->getBPKB(0, 9, $nobpkb);
			$data['result18']  = $this->MCetakQrCode->getBPKB(9, 18, $nobpkb);
			$data['result27']  = $this->MCetakQrCode->getBPKB(18, 27, $nobpkb);
			$data['result36']  = $this->MCetakQrCode->getBPKB(27, 36, $nobpkb);
			$data['result45']  = $this->MCetakQrCode->getBPKB(36, 45, $nobpkb);
			$data['result54']  = $this->MCetakQrCode->getBPKB(45, 54, $nobpkb);
		} else {
			$data = '';
		}

		// DELETE FILE IN TEMP FOLDER
		$files = glob('D:\XAMPP\htdocs\bpkb\temp\qrcode\/*');
		foreach($files as $file){ // iterate files
			if(is_file($file)) {
				unlink($file); // delete file
			}
		}

		$html = $this->load->view('print/vqrcode', $data, true);
		$pdf = new Pdf('L', 'mm', 'A4', true, 'UTF-8', false);
		$pdf->SetTitle('CETAK QR CODE');
		$pdf->SetPrintHeader(false);
		$pdf->SetMargins(10, 10, 10, true);
		$pdf->SetPrintFooter(false);
		$pdf->SetAutoPageBreak(True, PDF_MARGIN_FOOTER);
		$pdf->SetAuthor('BPKB');
		$pdf->SetDisplayMode('real', 'default');
		$pdf->SetFont('', '', 7, '', false);
		$pdf->AddPage('L', 'A4');
		$pdf->writeHTML($html, true, false, true, false, '');
		$pdf->lastPage();
		$filename = uniqid(). '.pdf';
		$pdf->Output('D:\XAMPP\htdocs\bpkb\temp\qrcode\/'.trim($filename), 'F');

		$hasil = array(
			'src' => $filename
		);
		echo json_encode($hasil);
	}
}