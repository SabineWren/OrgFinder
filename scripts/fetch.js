let fetchSizeHistory = async function(sid){
	return await fetch("/backEnd/org_history.php?SID=" + sid)
	.then(r => r.json());
}
