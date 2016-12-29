$(function(){
	$(".outputContainer").hide();
	$(".train").click(function(){
			var docs= $(".docs").val().split("\n");
			traindocs(docs);

			$(".outputContainer").show();
	})

	$(".guess").click(function(){

		var gw = $(".guessText").val();
		

		var predictions = guess(gw);
		$(".output").html("");
		var t = '<table class="pure-table"><thead><tr><th>Class</th><th>Percentage</th></thead><tbody>';
		for(var k in predictions ){
			t+="<tr><td>"+k+"</td><td>"+predictions[k]+"</td></tr>"
		}

		$(".output").html(t);

	});

});