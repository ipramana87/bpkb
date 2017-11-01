<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class MMasterKreditur extends CI_Model
{
	public function __construct()
	{
		parent::__construct();
		$this->load->database();
	}

	public function checkkreditur($nKode)
	{
		$xSQL = ("
			SELECT fs_kode_kreditur, fs_nama_kreditur
			FROM tm_kreditur
			WHERE fs_kode_kreditur = '".trim($nKode)."'
		");

		$sSQL = $this->db->query($xSQL);
		return $sSQL;
	}

	public function listKrediturAll($sCari) 
	{
		$xSQL = ("
			SELECT fs_kode_kreditur, fs_nama_kreditur, fs_aktif
			FROM tm_kreditur
			
		");

		if (!empty($sCari)) {
			$xSQL = $xSQL.("
				WHERE fs_nama_kreditur LIKE '%".trim($sCari)."%'
			");
		}

		$sSQL = $this->db->query($xSQL);
		return $sSQL;
	}

	public function listKreditur($sCari, $nStart, $nLimit)
	{
		$xSQL = ("
			SELECT fs_kode_kreditur, fs_nama_kreditur, fs_aktif
			FROM tm_kreditur 

		");

		if (!empty($sCari)) {
			$xSQL = $xSQL.("
				WHERE fs_nama_kreditur LIKE '%".trim($sCari)."%'
			");
		}

		$xSQL = $xSQL.("
			ORDER BY fd_tanggal_buat DESC LIMIT ".$nStart.",".$nLimit."
		");

		$sSQL = $this->db->query($xSQL);
		return $sSQL;
	}
}