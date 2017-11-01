<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class MMasterPenyimpanan extends CI_Model
{
	public function __construct()
	{
		parent::__construct();
		$this->load->database();
	}
	public function checkPenyimpanan($nKode)
	{
		$xSQL = ("
			SELECT fs_kode_cabang, fs_kode_brangkas, fs_nama_brangkas
			FROM tm_penyimpanan_bpkb
			WHERE fs_kode_brangkas = '".trim($nKode)."'
		");

		$sSQL = $this->db->query($xSQL);
		return $sSQL;
	}

	public function listPenyimpananAll($sCari) 
	{
		$xSQL = ("
			SELECT a.fs_kode_cabang, a.fs_kode_brangkas, a.fs_nama_brangkas,
				b.fs_nama_cabang
			FROM tm_penyimpanan_bpkb a
			LEFT JOIN tm_cabang b ON b.fs_kode_cabang = a.fs_kode_cabang 
		");

		if (!empty($sCari)) {
			$xSQL = $xSQL.("
				WHERE a.fs_nama_brangkas LIKE '%".trim($sCari)."%'
			");
		}

		$sSQL = $this->db->query($xSQL);
		return $sSQL;
	}

	public function listPenyimpan($sCari, $nStart, $nLimit)
	{
		$xSQL = ("
			SELECT a.fs_kode_cabang, a.fs_kode_brangkas, a.fs_nama_brangkas,
				b.fs_nama_cabang
			FROM tm_penyimpanan_bpkb a
			LEFT JOIN tm_cabang b ON b.fs_kode_cabang = a.fs_kode_cabang 
		");

		if (!empty($sCari)) {
			$xSQL = $xSQL.("
				WHERE a.fs_nama_brangkas LIKE '%".trim($sCari)."%'
			");
		}

		$xSQL = $xSQL.("
			ORDER BY a.fd_tanggal_buat DESC LIMIT ".$nStart.",".$nLimit."
		");

		$sSQL = $this->db->query($xSQL);
		return $sSQL;
	}
}