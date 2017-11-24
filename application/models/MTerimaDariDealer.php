<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class MTerimaDariDealer extends CI_Model
{
	public function __construct()
	{
		parent::__construct();
		$this->load->database();
	}

	public function listTBOAll($sCari)
	{
		$xSQL = ("
			SELECT fs_kode_cabang, fn_no_apk, fs_no_pjj, fs_nama_konsumen, fd_tgl_apk, fs_nama_dealer, fs_model_kendaraan, fn_tahun_kendaraan, fs_warna_kendaraan, fs_no_rangka, fs_no_mesin
			FROM tx_apk 
			
		");

		if (!empty($sCari)) {
			$xSQL = $xSQL.("
				AND fs_no_pjj LIKE '%".trim($sCari)."%'
			");
		}

		$sSQL = $this->db->query($xSQL);
		return $sSQL;
	}

	public function listTBO($sCari, $nStart, $nLimit)
	{
		$xSQL = ("
			SELECT fs_kode_cabang, fn_no_apk, fs_no_pjj, fs_nama_konsumen, fd_tgl_apk, fs_nama_dealer, fs_model_kendaraan, fn_tahun_kendaraan, fs_warna_kendaraan, fs_no_rangka, fs_no_mesin
			FROM tx_apk 
			
			
		");

		if (!empty($sCari)) {
			$xSQL = $xSQL.("
				AND fs_no_pjj LIKE '%".trim($sCari)."%'
			");
		}

		$xSQL = $xSQL.("
			ORDER BY fd_tanggal_buat DESC LIMIT ".$nStart.",".$nLimit."
		");

		$sSQL = $this->db->query($xSQL);
		return $sSQL;
	}

	function apkPendukungAll($nKdCab, $nApk, $sCari)
	{
		$xSQL = ("
			SELECT a.fs_kode_dokumen, a.fs_dokumen_upload, a.fs_iduser_buat, 
			a.fd_tanggal_buat, b.fs_nama_dokumen,
			CASE b.fs_wajib WHEN '1' THEN 'WAJIB DIISI' WHEN '0' THEN 'PILIHAN' END wajib
			FROM tx_apk_data_pendukung a 
			JOIN  tm_data_pendukung b  ON a.fs_kode_dokumen = b.fs_kode_dokumen
			WHERE a.fs_kode_cabang = '".trim($nKdCab)."' AND a.fn_no_apk IN ('".trim($nApk)."')
		");

		if ($this->session->userdata('gKodeCabang') != '00')
		{
			/*
			$xSQL = $xSQL.("
				AND a.fs_kode_cabang = '".trim($this->session->userdata('gKodeCabang'))."'	
			");
			*/
		}

		if (trim($sCari) <> '')
		{
			$xSQL = $xSQL.("
			AND (a.fs_kode_dokumen LIKE '%".trim($sCari)."%'
					OR b.fs_nama_dokumen LIKE '%".trim($sCari)."%')
			");
		}
		
		$sSQL = $this->db->query($xSQL);
		return $sSQL;
	}

	function apkPendukung($nKdCab, $nApk, $sCari, $nStart, $nLimit)
	{
		$xSQL = ("
			SELECT a.fs_kode_dokumen, a.fs_dokumen_upload, 
			a.fs_iduser_buat, a.fd_tanggal_buat, b.fs_nama_dokumen,
			CASE b.fs_wajib WHEN '1' THEN 'WAJIB DIISI' WHEN '0' THEN 'PILIHAN' END wajib
			FROM tx_apk_data_pendukung a 
			JOIN  tm_data_pendukung b  ON a.fs_kode_dokumen = b.fs_kode_dokumen
			WHERE a.fs_kode_cabang = '".trim($nKdCab)."' AND a.fn_no_apk IN ('".trim($nApk)."')
		");

		if ($this->session->userdata('gKodeCabang') != '00')
		{
			/*
			$xSQL = $xSQL.("
				AND a.fs_kode_cabang = '".trim($this->session->userdata('gKodeCabang'))."'	
			");
			*/
		}

		if (trim($sCari) <> '')
		{
			$xSQL = $xSQL.("
			AND (a.fs_kode_dokumen LIKE '%".trim($sCari)."%'
					OR b.fs_nama_dokumen LIKE '%".trim($sCari)."%')
			");
		}

		$xSQL = $xSQL.("
			ORDER BY b.fs_kode_dokumen ASC LIMIT ".$nStart.",".$nLimit."
		");

		$sSQL = $this->db->query($xSQL);
		return $sSQL;
	}

	function dataPendukungAll($sCari)
	{
		$xSQL = ("
			SELECT	fs_kode_dokumen, fs_jenis_pembiayaan, fs_nama_dokumen, fs_jenis_dokumen,
			CASE fs_wajib WHEN '1' THEN 'WAJIB DIISI' WHEN '0' THEN 'PILIHAN' END wajib
			FROM tm_data_pendukung
			WHERE fs_jenis_dokumen = 'SURVEY'
		");

		if (trim($sCari) <> '')
		{
			$xSQL = $xSQL.("
			AND (fs_kode_dokumen LIKE '%".trim($sCari)."%'
					OR fs_nama_dokumen LIKE '%".trim($sCari)."%')
			");
		}

		$sSQL = $this->db->query($xSQL);
		return $sSQL;
	}

	function dataPendukung($sCari,$nStart,$nLimit)
	{
		$xSQL = ("
			SELECT	fs_kode_dokumen, fs_jenis_pembiayaan, fs_nama_dokumen, fs_jenis_dokumen,
			CASE fs_wajib WHEN '1' THEN 'WAJIB DIISI' WHEN '0' THEN 'PILIHAN' END wajib
			FROM tm_data_pendukung
			WHERE fs_jenis_dokumen = 'SURVEY'
		");

		if (trim($sCari) <> '')
		{
			$xSQL = $xSQL.("
			AND (fs_kode_dokumen LIKE '%".trim($sCari)."%'
					OR fs_nama_dokumen LIKE '%".trim($sCari)."%')
			");
		}

		$xSQL = $xSQL.("
			ORDER BY fs_kode_dokumen LIMIT ".$nStart.",".$nLimit."
		");

		$sSQL = $this->db->query($xSQL);
		return $sSQL;
	}

	function checkDataPendukung($nApk, $nKdDoc, $nKdCab)
	{
		$xSQL = ("
			SELECT fn_no_apk, fs_kode_dokumen
			FROM tx_apk_data_pendukung
			WHERE fn_no_apk = '".trim($nApk)."' 
			AND fs_kode_dokumen = '".trim($nKdDoc)."'
			AND fs_kode_cabang = '".trim($nKdCab)."'	
		");

		$sSQL = $this->db->query($xSQL);
		return $sSQL;
	}

	function listdetail($nBatch)
	{
		$xSQL = ("
			SELECT * 
			FROM tx_apk
			WHERE fn_no_batch = '".trim($nBatch)."'
			AND fs_fleet = 'Y' AND fn_no_batch IS NOT NULL
		");

		if ($this->session->userdata('gKodeCabang') != '00')
		{
			$xSQL = $xSQL.("
			AND fs_kode_cabang = '".trim($this->session->userdata('gKodeCabang'))."'
			");
		}

		$sSQL = $this->db->query($xSQL);
		return $sSQL;
	}

}
