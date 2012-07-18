var Settings = {
	ApplicationID: "Please your application id here.",
	JavascriptKey: "Place your javascript key here.",
	DefaultText: "Oh hell no!",
	SaveRebukeText: "Save...",
	RebuttalSaved: "Your rebuttal has been successfully saved.",
	RebuttalSaveError: "There was a problem saving your rebuttal. Please try again at another time.",
	SelectDisagreedSkills: "Select the skills and expertise that you disagree with.",
	ErrorRetrievingObjects: "There was an error retrieving the needed objects: "
};

$(function() {
	
	var ohHellNo = $(document.createElement("a"));

	Parse.initialize(Settings.ApplicationID, Settings.JavascriptKey);
	InitializeOhHellNos();
	
	ohHellNo.text(Settings.DefaultText).addClass("action primary btn-action")
		.css({
			"padding": "5px",
			"float": "right",
			"top": -10,
			"position": "relative"
		})
		.attr("data-saveRebuttals", "false")
		.click(function() {
		
			var toSave = $(this).attr("data-saveRebuttals") === "true";
		
			if(toSave) {
			
				var personId = GetQuerystringValue("id");
			
				DeleteAllRebuttals(personId);
			
				$("ol.skills del").each(function() {
				
					var skill = $(this).text().trim();
					var HellNoObject = Parse.Object.extend("HellNoObject");
					var hellNoObject = new HellNoObject();

					hellNoObject.save(
						{
							personId: personId,
							skill: skill
						}, 
						{
							success: function(object) {
								
								$.toast({
									message: Settings.RebuttalSaved,
									displayTime: 4000,
									inTime: 100,
									outTime: 400,
									vPosition: "top",
									hPosition: "right"
								});
							
							},
							error: function(model, error) {
						
								$.toast({
									message: Settings.RebuttalSaveError,
									displayTime: 4000,
									inTime: 100,
									outTime: 400,
									vPosition: "top",
									hPosition: "right"
								});
							}
						}
					);
				
				});
							
				$(this).text(Settings.DefaultText);
				$(this).attr("data-saveRebuttals", "false");
				$("ol.skills a").unbind("click");
			
			} else {
			
				$(this).text(Settings.SaveRebukeText);
				$(this).attr("data-saveRebuttals", "true");
			
				$.toast({
					message: Settings.SelectDisagreedSkills,
					displayTime: 4000,
					inTime: 100,
					outTime: 400,
					vPosition: "top",
					hPosition: "right"
				});
								
				$("ol.skills a").bind("click", ToggleStrikethrough);
			}
					
		
		});
	
	$("#profile-skills div.header h2").append(ohHellNo);
	
});

var InitializeOhHellNos = function()
{
	var HellNoObject = Parse.Object.extend("HellNoObject");
	var query = new Parse.Query(HellNoObject);
	
	query.equalTo("personId", GetQuerystringValue("id"));
	
	query.find({
		success: function(results) {
		
			$(results).each(function() {
			
				var skill = this.get("skill").trim();
				var skillElement = $("ol.skills a:contains('" + skill + "')");
				var del = $(document.createElement("del"));
				var ohhellno = $(document.createElement("a"));
				
				ohhellno.text(Settings.DefaultText).css({
					"color": "Red",
					"margin-left": 5
				}).attr("data-onhellno", "");
				
				del.text(skill).css("color", "Red");
				
				skillElement.empty().append(del);
				skillElement.append(ohhellno);
			
			});
		
		},
		error: function(error) {
			
			$.toast({
				message: Settings.ErrorRetrievingObjects + error,
				displayTime: 4000,
				inTime: 100,
				outTime: 400,
				vPosition: "top",
				hPosition: "right"
			});
			
		}
	});
	
};

var DeleteAllRebuttals = function(personId)
{

	var HellNoObject = Parse.Object.extend("HellNoObject");
	var query = new Parse.Query(HellNoObject);
	
	query.equalTo("personId", personId);
	
	query.find({
		success: function(results) {
		
			if(results != null && results.length > 0) {
				
				$(results).each(function() {
				
					this.destroy();
				
				});
				
			} else {
			
				if(doesntExist != null)
					doesntExist();
			
			}
		
		},
		error: function(error) {
			
			$.toast({
				message: Settings.ErrorRetrievingObjects + error,
				displayTime: 4000,
				inTime: 100,
				outTime: 400,
				vPosition: "top",
				hPosition: "right"
			});
			
		}
	});

};

var RebuttalExists = function(personId, skill, exists, doesntExist)
{
	var HellNoObject = Parse.Object.extend("HellNoObject");
	var query = new Parse.Query(HellNoObject);
	
	query.equalTo("personId", GetQuerystringValue("id"));
	query.equalTo("skill", skill);
	
	query.find({
		success: function(results) {
		
			if(results != null && results.length > 0) {
				
				if(exists != null)
					exists();
				
			} else {
			
				if(doesntExist != null)
					doesntExist();
			
			}
		
		},
		error: function(error) {
			
			$.toast({
				message: Settings.ErrorRetrievingObjects + error,
				displayTime: 4000,
				inTime: 100,
				outTime: 400,
				vPosition: "top",
				hPosition: "right"
			});
			
		}
	});
};

var ToggleStrikethrough = function(e) {
	
	var hasStrikethrough = $(this).find("del").length > 0;
	
	if(hasStrikethrough) {
	
		var del = $(this).find("del");
		var skill = del.text();
		
		del.remove();
		
		$(this).empty().text(skill);
			
	} else {
	
		var skill = $(this).text();
		var del = $(document.createElement("del"));
		var ohhellno = $(document.createElement("a"));
		
		ohhellno.text(Settings.DefaultText).css({
			"color": "Red",
			"margin-left": 5
		}).attr("data-onhellno", "");
		
		del.text(skill).css("color", "Red");
		
		$(this).empty().append(del);
		$(this).append(ohhellno);
		
	}
	
	e.preventDefault();
};

var GetQuerystringValue = function(name)
{
	name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");

	var regexS = "[\\?&]" + name + "=([^&#]*)";
	var regex = new RegExp(regexS);
	var results = regex.exec(window.location.search);

	if(results == null)
		return "";
	else
		return decodeURIComponent(results[1].replace(/\+/g, " "));
};
