<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class MKirimKePusat extends CI_Model
{
	public function __construct()
	{
		parent::__construct();
		$this->load->database();
	}
	public function listKirimkAll($sCari)
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
				AND fn_no_apk LIKE '%".trim($sCari)."%'
			");
		}

		$sSQL = $this->db->query($xSQL);
		return $sSQL;
	}

	public function listKirim($sCari, $nStart, $nLimit)
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
				AND fn_no_apk LIKE '%".trim($sCari)."%'
			");
		}

		$xSQL = $xSQL.("
			ORDER BY fd_tanggal_buat DESC LIMIT ".$nStart.",".$nLimit."
		");

		$sSQL = $this->db->query($xSQL);
		return $sSQL;
	}

	
}