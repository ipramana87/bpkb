<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Terimadaridealer extends CI_Controller {

	public function __construct() {
		parent::__construct();
		if ($this->session->userdata('login') <> TRUE) {
			redirect('login');
		}
	}

	public function index() {
		$this->load->view('vterimabpkbdaridealer');
	}


	public function gridtbo() {
		$sCari = trim($this->input->post('fs_cari'));
		$nStart = trim($this->input->post('start'));
		$nLimit = trim($this->input->post('limit'));

		$this->db->trans_start();
		$this->load->model('MTerimaDariDealer');
		$sSQL = $this->MTerimaDariDealer->listTBOAll($sCari);
		$xTotal = $sSQL->num_rows();
		$sSQL = $this->MTerimaDariDealer->listTBO($sCari, $nStart, $nLimit);
		$this->db->trans_complete();

		$xArr = array();
		if ($sSQL->num_rows() > 0) {
			foreach ($sSQL->result() as $xRow) {
				$xArr[] = array(
					//'fs_kode_cabang' => trim($xRow->fs_kode_cabang),
					'fn_no_apk' => trim($xRow->fn_no_apk),
					'fs_no_pjj' => trim($xRow->fs_no_pjj),
					'fs_nama_konsumen' => trim($xRow->fs_nama_konsumen),
					//'fd_tgl_apk' => trim($xRow->fd_tgl_apk),
					'fs_nama_dealer' => trim($xRow->fs_nama_dealer),
					'fs_model_kendaraan' => trim($xRow->fs_model_kendaraan),
					'fn_tahun_kendaraan' => trim($xRow->fs_model_kendaraan),
					'fs_warna_kendaraan' => trim($xRow->fs_warna_kendaraan),
					'fs_no_rangka' => trim($xRow->fs_no_rangka),
					'fs_no_mesin' => trim($xRow->fs_no_mesin)
				);
			}
		}
		echo '({"total":"'.$xTotal.'","hasil":'.json_encode($xArr).'})';

	}

	public function ambilPlat()
	{

		$nStart = trim($this->input->post('start'));
		$nLimit = trim($this->input->post('limit'));
		
		$cari = trim($this->input->post('fs_cari'));

		$this->load->model('MSearch');
		$sSQL = $this->MSearch->ambilPlatAll($cari);
		$xTotal = $sSQL->num_rows();

		$sSQL = $this->MSearch->ambilPlat($cari,$nStart,$nLimit);
		$this->db->trans_complete();	



		$xArr = array();
		if ($sSQL->num_rows() > 0)
		{
			foreach ($sSQL->result() as $xRow)
			{
				$xArr[] = array(
					'fs_kode_plat'	=> trim($xRow->fs_kode_plat),
					'fs_wilayah'	=> trim($xRow->fs_wilayah),
					'fs_kode_wilayah'	=> trim($xRow->fs_kode_wilayah)
				);
			}
		}
		echo '({"total":"'.$xTotal.'","hasil":'.json_encode($xArr).'})';
	}

	public function apkpendukung()
	{
		$nStart = trim($this->input->post('start'));
		$nLimit = trim($this->input->post('limit'));
		$cari = trim($this->input->post('fs_cari'));

		$kdcabang = trim($this->input->post('fs_kode_cabang'));
		$noapk = trim($this->input->post('fn_no_apk'));
		$nobatch = trim($this->input->post('fn_no_batch'));
		$this->load->model('MTerimaDariDealer');
		if ($noapk <> '')
		{
			$this->db->trans_start();
			$sSQL = $this->MTerimaDariDealer->apkPendukungAll($kdcabang, $noapk, $cari);
			$xTotal = $sSQL->num_rows();
			$sSQL = $this->MTerimaDariDealer->apkPendukung($kdcabang,$noapk,$cari,$nStart,$nLimit);
			$this->db->trans_complete();
			$xArr = array();
			if ($sSQL->num_rows() > 0)
			{
				foreach ($sSQL->result() as $xRow)
				{
					$xArr[] = array(
						'fs_kode_dokumen' => trim($xRow->fs_kode_dokumen),
						'fs_nama_dokumen' => trim($xRow->fs_nama_dokumen),
						'fs_dokumen_upload' =>trim($xRow->fs_dokumen_upload),
						'fs_kode_dokumen' => trim($xRow->fs_kode_dokumen),
						'fs_wajib' => trim($xRow->fs_wajib),
						'fs_iduser_buat' => trim($xRow->fs_iduser_buat),
						'fd_tanggal_buat' => trim($xRow->fd_tanggal_buat)
					);
				}
			}
		}
		else if ($nobatch <> '')
		{
			$xnoapk = $this->MTerimaDariDealer->listdetail($nobatch);
			foreach ($xnoapk->result() as $row) {
				$this->db->trans_start();
				$sSQL = $this->MTerimaDariDealer->apkPendukungAll($kdcabang, $row->fn_no_apk, $cari);
				$xTotal = $sSQL->num_rows();
				$sSQL = $this->MTerimaDariDealer->apkPendukung($kdcabang, $row->fn_no_apk,$cari,$nStart,$nLimit);
				$this->db->trans_complete();
				$xArr = array();
				if ($sSQL->num_rows() > 0)
				{
					foreach ($sSQL->result() as $xRow)
					{
						$xArr[] = array(
						'fs_kode_dokumen' => trim($xRow->fs_kode_dokumen),
						'fs_nama_dokumen' => trim($xRow->fs_nama_dokumen),
						'fs_dokumen_upload' =>trim($xRow->fs_dokumen_upload),
						'fs_kode_dokumen' => trim($xRow->fs_kode_dokumen),
						'fs_wajib' => trim($xRow->fs_wajib),
						'fs_iduser_buat' => trim($xRow->fs_iduser_buat),
						'fd_tanggal_buat' => trim($xRow->fd_tanggal_buat)
						);
					}
				}
			}

		}
		else {
			$xTotal = 0;
			$xArr = array();
		}
		echo '({"total":"'.$xTotal.'","hasil":'.json_encode($xArr).'})';
	}

	function datapendukung()
	{
		$nStart = trim($this->input->post('start'));
		$nLimit = trim($this->input->post('limit'));
		
		$cari = trim($this->input->post('fs_cari'));
		$this->db->trans_start();
		$this->load->model('MTerimaDariDealer');
		$sSQL = $this->MTerimaDariDealer->dataPendukungAll($cari);
		$xTotal = $sSQL->num_rows();
		$sSQL = $this->MTerimaDariDealer->dataPendukung($cari,$nStart,$nLimit);
		$this->db->trans_complete();
		$xArr = array();
		if ($sSQL->num_rows() > 0)
		{	
			foreach ($sSQL->result() as $xRow)
			{
				$xArr[] = array(
					'fs_kode_dokumen' => trim($xRow->fs_kode_dokumen),
					'fs_jenis_pembiayaan' => trim($xRow->fs_jenis_pembiayaan),
					'fs_nama_dokumen' => trim($xRow->fs_nama_dokumen),
					'fs_wajib' => trim($xRow->wajib)
				);
			}
		}
		echo '({"total":"'.$xTotal.'","hasil":'.json_encode($xArr).'})';
	}

	public function remove() {
	}

	public function uploadfile() {
		if(!empty($_FILES['fileDoc']['name']))
		{
			$config['upload_path'] = './uploads/';
			$config['max_size'] = 1000;
			$config['allowed_types'] = 'gif|jpg|jpeg|png';
			$config['file_name'] = $_FILES['fileDoc']['name'];
			$config['encrypt_name'] = TRUE;

			$this->load->library('upload', $config);
			$this->upload->initialize($config);
			
			if ($this->upload->do_upload('fileDoc'))
			{

				$uploadData = $this->upload->data();
				$file = $uploadData['file_name'];

				$kdcabang = trim($this->input->post('txtKdCabang'));
				$noapk = trim($this->input->post('txtNoApk'));
				$nobatch = trim($this->input->post('txtNoBatch'));
				$kodedoc = trim($this->input->post('cboKodeDoc'));
				$jnspmb = trim($this->input->post('txtJnsPembiayaan'));

				if ($noapk <> '')
				{
					$this->load->model('MTerimaDariDealer');
					$sSQL = $this->MTerimaDariDealer->checkDataPendukung($noapk, $kodedoc, $kdcabang);
					if ($sSQL->num_rows() > 0)
					{
						$response = array(
								  		'success' => false, 
								  		'msg' => 'Dokumen yang sama sudah di Upload !!'
								  	);
						echo json_encode($response);
						unlink('uploads/'. $file);
					}
					else
					{
						$insert = array(
							'fs_kode_cabang' => $kdcabang,
							'fs_jenis_pembiayaan' => $jnspmb,
							'fn_no_apk' => $noapk,
							'fs_kode_dokumen' => $kodedoc,
							'fs_dokumen_upload' => $file,
							'fs_iduser_buat' => trim($this->session->userdata('gUser')),
							'fd_tanggal_buat' => trim(date('Y-m-d'))
						);
						$exec = $this->db->insert('tx_apk_data_pendukung', $insert);
						
						if ($exec) {
							$response = array(
											'success' => true, 
								    		'data' => array(
								    				'name' => $file),
								    		'msg' => 'File Uploaded successfully'
										);
							echo json_encode($response);
						}
						else {
							$response = array(
								  			'success' => false, 
								  			'msg' => 'Gagal'
								  		);
							echo json_encode($response);
						}
					}
				}
				else if ($nobatch <> '')
				{
					$this->db->trans_start();
					$this->load->model('MTerimaDariDealer');
					$xnoapk = $this->MTerimaDariDealer->listdetail($nobatch);
					foreach ($xnoapk->result() as $row) {

						$sSQL = $this->MTerimaDariDealer->checkDataPendukung($row->fn_no_apk, $kodedoc, $kdcabang);
						if ($sSQL->num_rows() > 0)
						{
							$response = array(
									  		'success' => false, 
									  		'msg' => 'Dokumen yang sama sudah di Upload !!'
									  	);
							echo json_encode($response);
							unlink('uploads/'. $file);

							return false;
						}
						else
						{
							$insert2 = array(
								'fs_kode_cabang' => $kdcabang,
								'fs_jenis_pembiayaan' => $jnspmb,
								'fn_no_apk' => $row->fn_no_apk,
								'fs_kode_dokumen' => $kodedoc,
								'fs_dokumen_upload' => $file,
								'fs_iduser_buat' => trim($this->session->userdata('gUser')),
								'fd_tanggal_buat' => trim(date('Y-m-d'))
							);
							$exec2 = $this->db->insert('tx_apk_data_pendukung', $insert2);
						}
						
					}
					if ($exec2) {
						$response = array(
									'success' => true, 
								    'data' => array(
								    			'name' => $file),
								    'msg' => 'File Uploaded successfully'
									);
						echo json_encode($response);
					}
					else {
						$response = array(
								  	'success' => false, 
								  	'msg' => 'Gagal'
								  	);
						echo json_encode($response);
					}
				}
				else {
					$response = array(
							  		'success' => false, 
							  		'msg' => 'Konsumen belum dipilih'
							  	);
					echo json_encode($response);
				}
			}
			else
			{
				$response = array(
							  'success' => false, 
							  'msg' => $this->upload->display_errors()
							);
				echo json_encode($response);
			}
		}
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
					'fs_nama_loker'	=> trim($xRow->fs_nama_loker),
					'fs_nama_brangkas' => trim($xRow->fs_nama_brangkas)
				);
			}
		}
		echo '({"total":"'.$xTotal.'","hasil":'.json_encode($xArr).'})';
	}
}