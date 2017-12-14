<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class MSearch extends CI_Model {

	public function __construct()
	{
			parent::__construct();
		$this->load->database();
	}

	public function checkbpkb($nKode)
	{
		$xSQL = ("
			SELECT fs_transaksi, fn_no_pjj, fs_nama_pemilik, fs_status,
				fs_kode_lokasi, fs_kode_cabang, fs_kode_kendaraan, fs_jenis_kendaraan,
				fn_tahun_kendaraan, fs_warna_kendaraan, fs_silinder_kendaraan,
				fs_no_polisi, fs_no_rangka, fs_no_mesin, fs_no_bpkb, fs_nama_bpkb, fs_no_faktur, fd_tanggal_bpkb, fs_nama_loker, fs_tempat_bpkb 
			FROM tx_detailbpkb
			WHERE fn_no_pjj = '".trim($nKode)."'
		");

		$sSQL = $this->db->query($xSQL);
		return $sSQL;
	}

	public function listCabangAll($sCari)
	{
		$xSQL = ("
			SELECT fs_kode_cabang, fs_nama_cabang
			FROM tm_cabang
			WHERE fs_aktif = '1'
		");

		if (!empty($sCari)) {
			$xSQL = $xSQL.("
				AND fs_nama_cabang LIKE '%".trim($sCari)."%'
			");
		}

		$sSQL = $this->db->query($xSQL);
		return $sSQL;
	}

	public function listCabang($sCari, $nStart, $nLimit)
	{
		$xSQL = ("
			SELECT fs_kode_cabang, fs_nama_cabang
			FROM tm_cabang
			WHERE fs_aktif = '1'
		");

		if (!empty($sCari)) {
			$xSQL = $xSQL.("
				AND fs_nama_cabang LIKE '%".trim($sCari)."%'
			");
		}

		$xSQL = $xSQL.("
			ORDER BY fs_kode_cabang ASC LIMIT ".$nStart.",".$nLimit."
		");
		$sSQL = $this->db->query($xSQL);
		return $sSQL;
	}

		public function listUserAll($sCari) 
	{
		$xSQL = ("
			SELECT fs_username, fs_level_user, fd_tanggal_buat
			FROM tm_user
		");

		if (!empty($sCari)) {
			$xSQL = $xSQL.("
				WHERE fs_username LIKE '%".trim($sCari)."%'
			");
		}

		$sSQL = $this->db->query($xSQL);
		return $sSQL;
	}

	public function listUser($sCari, $nStart, $nLimit)
	{
		$xSQL = ("
			SELECT fs_username, fs_level_user, fd_tanggal_buat
			FROM tm_user
		");

		if (!empty($sCari)) {
			$xSQL = $xSQL.("
				WHERE fs_username LIKE '%".trim($sCari)."%'
			");
		}

		$xSQL = $xSQL.("
			ORDER BY fd_tanggal_buat DESC LIMIT ".$nStart.",".$nLimit."
		");

		$sSQL = $this->db->query($xSQL);
		return $sSQL;
	}

	 function ambilPlatAll($sCari)
	{
		$xSQL = ("
			SELECT	fs_kode_plat, fs_wilayah, fs_kode_wilayah
			FROM	tm_plat_kendaraan");
	
		if (trim($sCari) <> '')
		{
			$xSQL = $xSQL.("
			WHERE fs_kode_plat LIKE '%".trim($sCari)."%'");

		}
		
		$sSQL = $this->db->query($xSQL);
		return $sSQL;
	}

	public function ambilPlat($sCari,$nStart,$nLimit)
	{
		$xSQL = ("
			SELECT	fs_kode_plat, fs_wilayah, fs_kode_wilayah
			FROM	tm_plat_kendaraan");
	
		if (trim($sCari) <> '')
		{
			$xSQL = $xSQL.("
			WHERE fs_kode_plat LIKE '%".trim($sCari)."%'");

		}

		$xSQL = $xSQL.("
			ORDER BY fs_kode_plat DESC
		");
		
		$sSQL = $this->db->query($xSQL);
		return $sSQL;
	}

	public function listBPKBAll($sCari)
	{	
		$xSQL = ("
			SELECT fs_transaksi, fn_no_pjj, fs_nama_pemilik, fs_status,
				fs_kode_lokasi, fs_kode_cabang, fs_kode_kendaraan, fs_jenis_kendaraan,
				fn_tahun_kendaraan, fs_warna_kendaraan, fs_silinder_kendaraan,
				fs_no_polisi, fs_no_rangka, fs_no_mesin, fs_no_bpkb, fs_nama_bpkb, fs_no_faktur, fd_tanggal_bpkb, fs_nama_loker, fs_tempat_bpkb, fd_tanggal_terbit, fd_terbit_stnk  
			FROM tx_detailbpkb
			
		");

		if (!empty($sCari)) {
			$xSQL = $xSQL.("
				AND fs_no_bpkb LIKE '%".trim($sCari)."%'
			");
		}

		$sSQL = $this->db->query($xSQL);
		return $sSQL;
	}

	public function listBPKB($sCari,$nStart,$nLimit)
	{	
		$xSQL = ("
			SELECT fs_transaksi, fn_no_pjj, fs_nama_pemilik, fs_status,
				fs_kode_lokasi, fs_kode_cabang, fs_kode_kendaraan, fs_jenis_kendaraan,
				fn_tahun_kendaraan, fs_warna_kendaraan, fs_silinder_kendaraan,
				fs_no_polisi, fs_no_rangka, fs_no_mesin, fs_no_bpkb, fs_nama_bpkb, fs_no_faktur, fd_tanggal_bpkb, fs_nama_loker, fs_tempat_bpkb, fd_tanggal_terbit, fd_terbit_stnk 
			FROM tx_detailbpkb
		
		");

		if (!empty($sCari)) {
			$xSQL = $xSQL.("
				AND fs_no_bpkb LIKE '%".trim($sCari)."%'
			");
		}

		$xSQL = $xSQL.("
			ORDER BY fs_no_bpkb ASC LIMIT ".$nStart.",".$nLimit."
		");
		$sSQL = $this->db->query($xSQL);
		return $sSQL;
	}

	public function listKrediturAll($sCari)
	{
		$xSQL = ("
			SELECT fs_kode_kreditur, fs_nama_kreditur
			FROM tm_kreditur
			
		");

		if (!empty($sCari)) {
			$xSQL = $xSQL.("
				AND fs_kode_kreditur LIKE '%".trim($sCari)."%'
			");
		}

		$sSQL = $this->db->query($xSQL);
		return $sSQL;
	}

	public function listKreditur($sCari,$nStart,$nLimit)
	{
		$xSQL = ("
			SELECT fs_kode_kreditur, fs_nama_kreditur
			FROM tm_kreditur
			
		");

		if (!empty($sCari)) {
			$xSQL = $xSQL.("
				AND fs_kode_kreditur LIKE '%".trim($sCari)."%'
			");
		}

		$xSQL = $xSQL.("
			ORDER BY fs_kode_kreditur ASC LIMIT ".$nStart.",".$nLimit."
		");
		$sSQL = $this->db->query($xSQL);
		return $sSQL;
	}

	public function listPenyimpananAll($sCari)
	{
		$xSQL = ("
			SELECT a.fs_kode_cabang, a.fs_kode_brangkas, a.fs_nama_loker, b.fs_nama_brangkas
			FROM tm_detailpenyimpanan_bpkb a
			LEFT JOIN tm_penyimpanan_bpkb b ON b.fs_kode_cabang = a.fs_kode_cabang 
			
		");

		if (!empty($sCari)) {
			$xSQL = $xSQL.("
				AND fs_kode_brangkas LIKE '%".trim($sCari)."%'
			");
		}

		$sSQL = $this->db->query($xSQL);
		return $sSQL;
	}

	public function listPenyimpanan($sCari,$nStart,$nLimit)
	{
		$xSQL = ("
			SELECT a.fs_kode_cabang, a.fs_kode_brangkas, a.fs_nama_loker, b.fs_nama_brangkas
			FROM tm_detailpenyimpanan_bpkb a
			LEFT JOIN tm_penyimpanan_bpkb b ON b.fs_kode_cabang = a.fs_kode_cabang 
			
		");

		if (!empty($sCari)) {
			$xSQL = $xSQL.("
				AND fs_kode_brangkas LIKE '%".trim($sCari)."%'
			");
		}

		$xSQL = $xSQL.("
			ORDER BY fs_kode_brangkas ASC LIMIT ".$nStart.",".$nLimit."
		");
		$sSQL = $this->db->query($xSQL);
		return $sSQL;
	}

	public function getDokumen($sJns, $sDok)
	{
		$xSQL = ("
			SELECT fs_kode_dokumen, fs_nama_dokumen
			FROM tm_data_pendukung
			WHERE fs_jenis_pembiayaan = '".trim($sJns)."'
			AND fs_jenis_dokumen = '".trim($sDok)."'
		");

		$xSQL = $xSQL.("
			ORDER BY fs_kode_dokumen ASC
		");

		$sSQL = $this->db->query($xSQL);
		return $sSQL;
	}

	public function listPendukungApkAll($sCari)
	{
		$xSQL = ("
			SELECT fs_kode_dokumen, fs_jenis_pembiayaan, fs_jenis_dokumen
				fs_nama_dokumen, fs_wajib
			FROM tm_data_pendukung
			WHERE fs_jenis_dokumen = 'APK'
		");

		if (!empty($sCari)) {
			$xSQL = $xSQL.("
				AND (fs_kode_dokumen LIKE '%".trim($sCari)."%'
					OR fs_nama_dokumen LIKE '%".trim($sCari)."%')
			");
		}

		$sSQL = $this->db->query($xSQL);
		return $sSQL;
	}

	public function listPendukungApk($sCari, $nStart, $nLimit)
	{
		$xSQL = ("
			SELECT fs_kode_dokumen, fs_jenis_pembiayaan, fs_jenis_dokumen
				fs_nama_dokumen, fs_wajib
			FROM tm_data_pendukung
			WHERE fs_jenis_dokumen = 'APK'
		");

		if (!empty($sCari)) {
			$xSQL = $xSQL.("
				AND (fs_kode_dokumen LIKE '%".trim($sCari)."%'
					OR fs_nama_dokumen LIKE '%".trim($sCari)."%')
			");
		}

		$xSQL = $xSQL.("
			ORDER BY fs_kode_dokumen ASC LIMIT ".$nStart.",".$nLimit."
		");

		$sSQL = $this->db->query($xSQL);
		return $sSQL;
	}

	public function listDataPendukungAll($nNopjj)
	{
		$xSQL = ("
			SELECT a.fs_kode_dokumen, b.fs_nama_dokumen, a.fs_dokumen_upload
			FROM tx_apk_data_pendukung a
			LEFT JOIN tm_data_pendukung b ON b.fs_kode_dokumen = a.fs_kode_dokumen
			WHERE a.fn_no_pjj = '".trim($nNopjj)."'
		");
		
		$sSQL = $this->db->query($xSQL);
		return $sSQL;
	}

	public function listDataPendukung($sKdCab, $nNopjj, $nStart, $nLimit)
	{
		$xSQL = ("
			SELECT a.fs_kode_dokumen, b.fs_nama_dokumen, a.fs_dokumen_upload
			FROM tx_apk_data_pendukung a
			LEFT JOIN tm_data_pendukung b ON b.fs_kode_dokumen = a.fs_kode_dokumen
			WHERE a.fn_no_pjj = '".trim($nNopjj)."'
		");

		$xSQL = $xSQL.("
			ORDER BY a.fs_kode_dokumen ASC LIMIT ".$nStart.",".$nLimit."
		");

		$sSQL = $this->db->query($xSQL);
		return $sSQL;
	}
}