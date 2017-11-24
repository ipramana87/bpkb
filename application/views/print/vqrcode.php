<table border="0" align="center" width="100%">
	<tbody>
		<?php if ($result9->num_rows() > 0) : ?>
		<tr>
			<?php foreach ($result9->result() as $value) : ?>
			<td align="center">
				<img src="<?php echo base_url('/uploads/qrcode/'.trim($value->fs_no_bpkb).'.png'); ?>" width="75px" height="75px" />
				<br>
				<?php echo $value->fs_no_bpkb; ?>
			</td>
			<?php endforeach; ?>
		</tr>
		<?php endif; ?>

		<?php if ($result18->num_rows() > 0) : ?>
		<tr>
			<?php foreach ($result18->result() as $value) : ?>
			<td align="center">
				<img src="<?php echo base_url('/uploads/qrcode/'.trim($value->fs_no_bpkb).'.png'); ?>" width="75px" height="75px" />
				<br>
				<?php echo $value->fs_no_bpkb; ?>
			</td>
			<?php endforeach; ?>
		</tr>
		<?php endif; ?>

		<?php if ($result27->num_rows() > 0) : ?>
		<tr>
			<?php foreach ($result27->result() as $value) : ?>
			<td align="center">
				<img src="<?php echo base_url('/uploads/qrcode/'.trim($value->fs_no_bpkb).'.png'); ?>" width="75px" height="75px" />
				<br>
				<?php echo $value->fs_no_bpkb; ?>
			</td>
			<?php endforeach; ?>
		</tr>
		<?php endif; ?>

		<?php if ($result36->num_rows() > 0) : ?>
		<tr>
			<?php foreach ($result36->result() as $value) : ?>
			<td align="center">
				<img src="<?php echo base_url('/uploads/qrcode/'.trim($value->fs_no_bpkb).'.png'); ?>" width="75px" height="75px" />
				<br>
				<?php echo $value->fs_no_bpkb; ?>
			</td>
			<?php endforeach; ?>
		</tr>
		<?php endif; ?>

		<?php if ($result45->num_rows() > 0) : ?>
		<tr>
			<?php foreach ($result45->result() as $value) : ?>
			<td align="center">
				<img src="<?php echo base_url('/uploads/qrcode/'.trim($value->fs_no_bpkb).'.png'); ?>" width="75px" height="75px" />
				<br>
				<?php echo $value->fs_no_bpkb; ?>
			</td>
			<?php endforeach; ?>
		</tr>
		<?php endif; ?>

		<?php if ($result54->num_rows() > 0) : ?>
		<tr>
			<?php foreach ($result54->result() as $value) : ?>
			<td align="center">
				<img src="<?php echo base_url('/uploads/qrcode/'.trim($value->fs_no_bpkb).'.png'); ?>" width="75px" height="75px" />
				<br>
				<?php echo $value->fs_no_bpkb; ?>
			</td>
			<?php endforeach; ?>
		</tr>
		<?php endif; ?>
	</tbody>
</table>