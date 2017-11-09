<table border="0" align="center" width="100%">
	<tbody>
		<tr>
			<?php foreach ($result9->result() as $value) : 
				$filename = str_replace(' ', '-', $value->fs_no_bpkb);
			?>
			<td align="center">
				<img src="<?php echo base_url('/uploads/qrcode/'.trim($filename).'.png'); ?>" width="75px" height="75px" />
			</td>
			<?php endforeach; ?>
		</tr>
		<tr>
			<?php foreach ($result18->result() as $value) : 
				$filename = str_replace(' ', '-', $value->fs_no_bpkb);
			?>
			<td align="center">
				<img src="<?php echo base_url('/uploads/qrcode/'.$filename.'.png'); ?>" width="75px" height="75px" />
			</td>
			<?php endforeach; ?>
		</tr>
		
	</tbody>
</table>