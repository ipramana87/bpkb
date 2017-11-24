<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class MApproveBPKB extends CI_Model
{
	public function __construct()
	{
		parent::__construct();
		$this->load->database();
	}

	public function listApproveAll($sCari) 
	{
		$xSQL = ("
			SELECT a.fs_transaksi, a.fn_no_pjj, a.fs_nama_pemilik, a.fs_status,
				a.fs_kode_lokasi, a.fs_kode_cabang, a.fs_kode_kendaraan, a.fs_jenis_kendaraan,
				a.fn_tahun_kendaraan, a.fs_warna_kendaraan, a.fs_silinder_kendaraan,
				a.fs_no_polisi, a.fs_no_rangka, a.fs_no_mesin, a.fs_no_bpkb, a.fs_nama_bpkb, a.fs_no_faktur, a.fd_tanggal_bpkb, b.fs_nama_cabang
			FROM tx_bpkb a
			LEFT JOIN tm_cabang b ON b.fs_kode_cabang = a.fs_kode_cabang 
		");

		if (!empty($sCari)) {
			$xSQL = $xSQL.("
				WHERE a.fn_no_pjj LIKE '%".trim($sCari)."%'
			");
		}

		$sSQL = $this->db->query($xSQL);
		return $sSQL;
	}

	public function listApprove($sCari, $nStart, $nLimit)
	{
		$xSQL = ("
			SELECT a.fs_transaksi, a.fn_no_pjj, a.fs_nama_pemilik, a.fs_status,
				a.fs_kode_lokasi, a.fs_kode_cabang, a.fs_kode_kendaraan, a.fs_jenis_kendaraan,
				a.fn_tahun_kendaraan, a.fs_warna_kendaraan, a.fs_silinder_kendaraan,
				a.fs_no_polisi, a.fs_no_rangka, a.fs_no_mesin, a.fs_no_bpkb, a.fs_nama_bpkb, a.fs_no_faktur, a.fd_tanggal_bpkb, b.fs_nama_cabang
			FROM tx_bpkb a
			LEFT JOIN tm_cabang b ON b.fs_kode_cabang = a.fs_kode_cabang 
		");

		if (!empty($sCari)) {
			$xSQL = $xSQL.("
				WHERE a.fn_no_pjj LIKE '%".trim($sCari)."%'
			");
		}

		$xSQL = $xSQL.("
			ORDER BY a.fn_no_pjj DESC LIMIT ".$nStart.",".$nLimit."
		");

		$sSQL = $this->db->query($xSQL);
		return $sSQL;
	}
}