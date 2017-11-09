<table border="0" align="center" width="100%">
	<tbody>
		<tr>
			<?php if (!empty($result9)) : ?>
				<?php foreach ($result9->result() as $value) : 
					$filename = str_replace(' ', '-', $value->fs_no_bpkb);
				?>
				<td align="center">
					<img src="<?php echo base_url('/uploads/qrcode/'.trim($filename).'.png'); ?>" width="75px" height="75px" />
				</td>
				<?php endforeach; ?>
			<?php endif; ?>
		</tr>
		<tr>
			<?php if (!empty($result18)) : ?>
				<?php foreach ($result18->result() as $value) : 
					$filename = str_replace(' ', '-', $value->fs_no_bpkb);
				?>
				<td align="center">
					<img src="<?php echo base_url('/uploads/qrcode/'.$filename.'.png'); ?>" width="75px" height="75px" />
				</td>
				<?php endforeach; ?>
			<?php endif; ?>
		</tr>
		<tr>
			<?php if (!empty($result27)) : ?>
				<?php foreach ($result27->result() as $value) : 
					$filename = str_replace(' ', '-', $value->fs_no_bpkb);
				?>
				<td align="center">
					<img src="<?php echo base_url('/uploads/qrcode/'.trim($filename).'.png'); ?>" width="75px" height="75px" />
				</td>
				<?php endforeach; ?>
			<?php endif; ?>
		</tr>
		<tr>
			<?php if (!empty($result36)) : ?>
				<?php foreach ($result36->result() as $value) : 
					$filename = str_replace(' ', '-', $value->fs_no_bpkb);
				?>
				<td align="center">
					<img src="<?php echo base_url('/uploads/qrcode/'.trim($filename).'.png'); ?>" width="75px" height="75px" />
				</td>
				<?php endforeach; ?>
			<?php endif; ?>
		</tr>
		<tr>
			<?php if (!empty($result45)) : ?>
				<?php foreach ($result45->result() as $value) : 
					$filename = str_replace(' ', '-', $value->fs_no_bpkb);
				?>
				<td align="center">
					<img src="<?php echo base_url('/uploads/qrcode/'.trim($filename).'.png'); ?>" width="75px" height="75px" />
				</td>
				<?php endforeach; ?>
			<?php endif; ?>
		</tr>
		<tr>
			<?php if (!empty($result54)) : ?>
				<?php foreach ($result54->result() as $value) : 
					$filename = str_replace(' ', '-', $value->fs_no_bpkb);
				?>
				<td align="center">
					<img src="<?php echo base_url('/uploads/qrcode/'.trim($filename).'.png'); ?>" width="75px" height="75px" />
				</td>
				<?php endforeach; ?>
			<?php endif; ?>
		</tr>
	</tbody>
</table>