<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class MMasterBPKB extends CI_Model
{
	public function __construct()
	{
		parent::__construct();
		$this->load->database();
	}

	public function checkPemeriksa($nKode)
	{
		$xSQL = ("
			SELECT fs_kode_cabang, fs_kode_pemeriksa, fs_nama_pemeriksa
			FROM tm_pemeriksa_bpkb
			WHERE fs_kode_pemeriksa = '".trim($nKode)."'
		");

		$sSQL = $this->db->query($xSQL);
		return $sSQL;
	}

	public function listPemeriksaAll($sCari) 
	{
		$xSQL = ("
			SELECT a.fs_kode_cabang, a.fs_kode_pemeriksa, a.fs_nama_pemeriksa,
				b.fs_nama_cabang
			FROM tm_pemeriksa_bpkb a
			LEFT JOIN tm_cabang b ON b.fs_kode_cabang = a.fs_kode_cabang 
		");

		if (!empty($sCari)) {
			$xSQL = $xSQL.("
				WHERE a.fs_nama_pemeriksa LIKE '%".trim($sCari)."%'
			");
		}

		$sSQL = $this->db->query($xSQL);
		return $sSQL;
	}

	public function listPemeriksa($sCari, $nStart, $nLimit)
	{
		$xSQL = ("
			SELECT a.fs_kode_cabang, a.fs_kode_pemeriksa, a.fs_nama_pemeriksa,
				b.fs_nama_cabang
			FROM tm_pemeriksa_bpkb a
			LEFT JOIN tm_cabang b ON b.fs_kode_cabang = a.fs_kode_cabang 
		");

		if (!empty($sCari)) {
			$xSQL = $xSQL.("
				WHERE a.fs_nama_pemeriksa LIKE '%".trim($sCari)."%'
			");
		}

		$xSQL = $xSQL.("
			ORDER BY a.fd_tanggal_buat DESC LIMIT ".$nStart.",".$nLimit."
		");

		$sSQL = $this->db->query($xSQL);
		return $sSQL;
	}
}