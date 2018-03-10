let fetchSizeHistory = async function(sid){
	return await fetch("/backEnd/org_history.php?SID=" + sid)
		.then(function(r){
			return { success: true, data: r.json() };
		})
		.catch(function(err){
			return { success: false, error: err };
		});
};
