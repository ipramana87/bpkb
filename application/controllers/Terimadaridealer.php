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

	public function ceksave() {
		$kode = $this->input->post('fn_no_pjj');
		
		if (!empty($kode)) {
			$this->load->model('MSearch');
			$sSQL = $this->MSearch->checkbpkb($kode);
			if ($sSQL->num_rows() > 0) {
				$hasil = array(
					'sukses' => true,
					'hasil' => 'BPKB sudah ada, apakah Anda ingin meng-update?'
				);
				echo json_encode($hasil);
			} else {
				$hasil = array(
					'sukses' => true,
					'hasil' => 'BPKB belum ada, apakah Anda ingin tambah baru?'
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

		$nopjj = $this->input->post('fn_no_pjj');
		$nama = $this->input->post('fs_nama_pemilik');
		$modelken = $this->input->post('fs_jenis_kendaraan');
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
		$ssql = $this->MSearch->checkbpkb($nopjj);
		$update = false;

		if ($ssql->num_rows() > 0) {
			$update = true;
		}

		$dt = array(
			'fn_no_pjj' => trim($nopjj),
			'fs_nama_pemilik' => trim($nama),
			'fs_jenis_kendaraan' => trim($modelken),
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
				'hasil' => 'Tambah BPKB'.trim($nopjj).', Sukses!!'
			);
			echo json_encode($hasil);
		} else {
			$dt2 = array(
				'fs_user_edit' => trim($user),
				'fd_tanggal_edit' => date('Y-m-d H:i:s')
			);

			$data = array_merge($dt, $dt2);
			$where = "fn_no_pjj = '".trim($nopjj)."'";
			$this->db->where($where);
			$this->db->update('tx_detailbpkb', $data);

			$hasil = array(
				'sukses' => true,
				'hasil' => 'Update BPKB '.trim($nopjj).', Sukses!!'
			);
			echo json_encode($hasil);
		}
	}

	public function gridtbo() {
		$sCari = trim($this->input->post('fs_cari'));
		$nStart = trim($this->input->post('start'));
		$nLimit = trim($this->input->post('limit'));

		$this->db->trans_start();
		$this->load->model('MTerimaDariDealer');
		$sSQL = $this->MTerimaDariDealer->listBPKBAll($sCari);
		$xTotal = $sSQL->num_rows();
		$sSQL = $this->MTerimaDariDealer->listBPKB($sCari, $nStart, $nLimit);
		$this->db->trans_complete();

		$xArr = array();
		if ($sSQL->num_rows() > 0) {
			foreach ($sSQL->result() as $xRow) {
				$xArr[] = array(
					'fn_no_pjj' => trim($xRow->fn_no_pjj),
					'fs_nama_pemilik' => trim($xRow->fs_nama_pemilik),
					//'fs_nama_dealer' => trim($xRow->fs_nama_dealer),
					'fs_jenis_kendaraan' => trim($xRow->fs_jenis_kendaraan),
					'fn_tahun_kendaraan' => trim($xRow->fn_tahun_kendaraan),
					'fs_warna_kendaraan' => trim($xRow->fs_warna_kendaraan),
					'fs_no_rangka' => trim($xRow->fs_no_rangka),
					'fs_no_mesin' => trim($xRow->fs_no_mesin)
				);
			}
		}
		echo '({"total":"'.$xTotal.'","hasil":'.json_encode($xArr).'})';
	}

	public function ambilPlat(){

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

	public function pendukungapk() {
		$nStart = trim($this->input->post('start'));
		$nLimit = trim($this->input->post('limit'));

		$cabang = $this->input->post('fs_kode_cabang');
		$nopjj = $this->input->post('fn_no_pjj');

		$this->db->trans_start();
		$this->load->model('MSearch');
		$sSQL = $this->MSearch->listDataPendukungAll($cabang, $nopjj);
		$xTotal = $sSQL->num_rows();
		$sSQL = $this->MSearch->listDataPendukung($cabang, $nopjj, $nStart, $nLimit);
		$this->db->trans_complete();
		
		$xArr = array();
		if ($sSQL->num_rows() > 0) {
			foreach ($sSQL->result() as $xRow) {
				$xArr[] = array(
					'fs_kode_dokumen' => trim($xRow->fs_kode_dokumen),
					'fs_nama_dokumen' => trim($xRow->fs_nama_dokumen),
					'fs_dokumen_upload' => trim($xRow->fs_dokumen_upload)
				);
			}
		}
		echo '({"total":"'.$xTotal.'","hasil":'.json_encode($xArr).'})';
	}

	public function selectdokumen() {
		$jenis = $this->input->post('fs_jenis_pembiayaan');
		$dokumen = $this->input->post('fs_jenis_dokumen');

		$this->db->trans_start();
		$this->load->model('MSearch');
		$sSQL = $this->MSearch->getDokumen($jenis, $dokumen);
		$this->db->trans_complete();
		$xArr = array();
		if ($sSQL->num_rows() > 0) {
			foreach ($sSQL->result() as $xRow) {
				$xArr[] = array(
					'fs_kode' => trim($xRow->fs_kode_dokumen),
					'fs_nama' => trim($xRow->fs_nama_dokumen)
				);
			}
		}
		echo json_encode($xArr);
	}

	public function uploadfile() {
		$user = $this->encryption->decrypt($this->session->userdata('username'));

		$cabang = $this->input->post('txtKdCabangPendukung');
		$nopjj = $this->input->post('txtNoAPKPendukung');
		$nobatch = $this->input->post('txtNoBatch');
		$kode = $this->input->post('cboDokumen');

		if(!empty($_FILES['fileDokumen']['name'])) {
			$config['upload_path'] = './uploads/';
			$config['max_size'] = 1000;
			$config['allowed_types'] = '*';
			$config['file_name'] = $_FILES['fileDokumen']['name'];
			$config['encrypt_name'] = TRUE;
			$config['file_ext_tolower'] = TRUE;
			$config['overwrite'] = TRUE;
			$this->load->library('upload', $config);
			$this->upload->initialize($config);

			if ($this->upload->do_upload('fileDokumen')) {
				$file = $this->upload->data();
				$filename = $file['file_name'];

				$this->load->model('MTerimaDariDealer');
				if(!empty($nopjj)) {
					$sSQL = $this->MTerimaDariDealer->checkDataPendukung($cabang, $nopjj, $kode);
					if ($sSQL->num_rows() > 0) {
						$response = array(
							'success' => false,
							'msg' => 'Dokumen yang sama sudah di upload...'
						);
						echo json_encode($response);
						unlink('uploads/'. $filename);
					} else {
						$data = array(
							'fs_kode_cabang' => trim($cabang),
							'fn_no_pjj' => trim($nopjj),
							'fs_kode_dokumen' => trim($kode),
							'fs_dokumen_upload' => trim($filename),
							'fs_user_buat' => trim($user),
							'fd_tanggal_buat' => date('Y-m-d H:i:s')
						);
						$this->db->insert('tx_apk_data_pendukung', $data);

						$response = array(
							'success' => true, 
							'data' => array('name' => $filename),
							'msg' => 'File Uploaded successfully...'
						);
						echo json_encode($response);
					}
				} 
				else if (!empty($cabang) && !empty($nobatch)) {
					$AllAPK = $this->MTerimaDariDealer->listDetail($nobatch);
					foreach ($AllAPK->result() as $row) {
						/*
						$sSQL = $this->MTerimaDariDealer->$cabang, $row->fn_no_apk, $kode);
						if ($sSQL->num_rows() > 0) {
							$response = array(
								'success' => false,
								'msg' => 'Dokumen yang sama sudah di upload...'
							);
							echo json_encode($response);
							unlink('uploads/'. $filename);
						} else {
							$data = array(
								'fs_kode_cabang' => trim($cabang),
								'fn_no_apk' => trim($row->fn_no_apk),
								'fs_jenis_pembiayaan' => trim($jenis),
								'fs_kode_dokumen' => trim($kode),
								'fs_dokumen_upload' => trim($filename),
								'fs_user_buat' => trim($user),
								'fd_tanggal_buat' => date('Y-m-d H:i:s')
							);

							$this->db->insert('tx_apk_data_pendukung', $data);
						}
						*/
					}

					$response = array(
						'success' => true, 
						'data' => array('name' => $filename),
						'msg' => 'File Uploaded successfully...'
					);
					echo json_encode($response);
				}
				else {
					$response = array(
						'success' => false,
						'msg' => 'APK belum dipilih, Silakan pilih di Daftar APK'
						);
					echo json_encode($response);
				}
			} else {
				$response = array(
					'success' => false,
					'msg' => $this->upload->display_errors()
				);
				echo json_encode($response);
			}
		} else {
			$response = array(
				'success' => false,
				'msg' => $this->upload->display_errors()
			);
			echo json_encode($response);
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

	public function remove() {
		$kode = $this->input->post('fs_dokumen_upload');
		$where = "fs_dokumen_upload = '".trim($kode)."'";
		$this->db->where($where);
		$this->db->delete('tx_apk_data_pendukung');

		$hasil = array(
				'sukses' => true,
				'hasil' => 'Hapus Data Pendukung '.trim($kode).', Sukses!!'
		);
		echo json_encode($hasil);
	}
}