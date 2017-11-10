<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class MCetakQrCode extends CI_Model
{
	public function __construct()
	{
		parent::__construct();
		$this->load->database();
	}

	public function listBPKBAll($sCari)
	{
		$xSQL = ("
			SELECT fs_transaksi, fn_no_pjj, fs_nama_pemilik, fs_status,
				fs_kode_lokasi, fs_kode_cabang, fs_kode_kendaraan, fs_jenis_kendaraan,
				fn_tahun_kendaraan, fs_warna_kendaraan, fs_silinder_kendaraan,
				fs_no_polisi, fs_no_rangka,fs_no_mesin, fs_no_bpkb, fs_nama_bpkb, fd_tanggal_bpkb
			FROM tx_bpkb 
			WHERE fs_flag_qrcode = '0'
		");

		if (!empty($sCari)) {
			$xSQL = $xSQL.("
				AND fs_no_bpkb LIKE '%".trim($sCari)."%'
			");
		}

		$sSQL = $this->db->query($xSQL);
		return $sSQL;
	}

	public function listBPKB($sCari, $nStart, $nLimit)
	{
		$xSQL = ("
			SELECT fs_transaksi, fn_no_pjj, fs_nama_pemilik, fs_status,
				fs_kode_lokasi, fs_kode_cabang, fs_kode_kendaraan, fs_jenis_kendaraan,
				fn_tahun_kendaraan, fs_warna_kendaraan, fs_silinder_kendaraan,
				fs_no_polisi, fs_no_rangka,fs_no_mesin, fs_no_bpkb, fs_nama_bpkb, fd_tanggal_bpkb
			FROM tx_bpkb
			WHERE fs_flag_qrcode = '0'
		");

		if (!empty($sCari)) {
			$xSQL = $xSQL.("
				AND fs_no_bpkb LIKE '%".trim($sCari)."%'
			");
		}

		$xSQL = $xSQL.("
			ORDER BY fd_tanggal_buat DESC LIMIT ".$nStart.",".$nLimit."
		");

		$sSQL = $this->db->query($xSQL);
		return $sSQL;
	}

	public function getBPKBAll($nKode)
	{
		$nIds = join("','", $nKode);

		$xSQL = ("
			SELECT fs_no_bpkb
			FROM tx_bpkb
			WHERE fs_no_bpkb IN ('".trim($nIds)."')
		");

		$sSQL = $this->db->query($xSQL);
		return $sSQL;
	}
	
	public function getBPKB($nStart, $nLimit, $nKode)
	{
		$nIds = join("','", $nKode);

		$xSQL = ("
			SELECT fs_no_bpkb
			FROM tx_bpkb
			WHERE fs_no_bpkb IN ('".trim($nIds)."')
		");

		$xSQL = $xSQL.("
			ORDER BY fd_tanggal_buat DESC LIMIT ".$nStart.",".$nLimit."
		");

		$sSQL = $this->db->query($xSQL);
		return $sSQL;
	}

}

