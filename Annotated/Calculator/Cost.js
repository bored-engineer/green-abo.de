// Redo both calculations
function updateResults() {

	// Get the Electrical Cost
    var electrical_cost = parseFloat($("#electrical_cost").val());

    // Get the Electrical Escalation Rate
    var electrical_escalation_rate = parseFloat($("#electrical_escalation_rate").val())/100;

	// Get the Period Value
	var period = parseInt($("#period").val(), 10);

	// Get the Capital Cost
	var capital_cost = parseFloat($("#capital_cost").val(), 10);

	// Get the Fixed O&M Cost
	var fixed_oandm_cost = parseFloat($("#fixed_oandm_cost").val(), 10);

	// Get the Variable O&M Cost
	var variable_oandm_cost =  parseFloat($("#variable_oandm_cost").val(), 10)*1000;

	// Get the Capactity Factor
	var capacity_factor = parseFloat($("#capacity_factor").val(), 10)/100;

	// Get the Fuel Cost
	var fuel_cost = parseFloat($("#fuel_cost").val(), 10);

	// Get the Heat Rate
	var heat_rate = parseFloat($("#heat_rate").val(), 10)/1000;

	// Calculate the crf
	var crf = parseFloat(
		(
			(Math.pow(1.03, period) * 0.03) / (Math.pow(1.03, period) - 1)
		).toFixed(3)
	);

	// Levelized Cost of Utility Electricity
    var year_1 = electrical_cost * (1 + electrical_escalation_rate);
    var present_value = 0;
    var GSPWF = 0;
    var average_electrical_cost = 0;
    if (0.03 === electrical_escalation_rate) {
        GSPWF = Math.pow((1.03), -1) * period;
        present_value = year_1 * GSPWF;
    } else {
        GSPWF = (1-((Math.pow((1 + electrical_escalation_rate), period))) * Math.pow((1.03), -period) )/ (0.03 - electrical_escalation_rate) ;
        present_value = year_1 * GSPWF;
    }
    average_electrical_cost = present_value * crf;
    average_electrical_cost = average_electrical_cost.toFixed(1);
    $("#average_electrical_cost").val(average_electrical_cost);

	// Calculate the Simple Levelized Cost of Renewable Energy
	var lcoe = parseFloat(
		(
			capital_cost * crf + fixed_oandm_cost
		) / (
			8.76 * capacity_factor
		)
	) + (fuel_cost * heat_rate) + variable_oandm_cost;
	lcoe = (
		Math.round(
			lcoe * 10
		) / 10
	) / 10;
	lcoe = lcoe.toFixed(1);

	// Set the value on the GUI
	$("#lcoe").val(lcoe);

}

// On any changes, update the results
$("#period, #capital_cost, #capacity_factor, #fixed_oandm_cost, #variable_oandm_cost, #heat_rate, #fuel_cost, #electrical_cost, #electrical_escalation_rate").change(updateResults);