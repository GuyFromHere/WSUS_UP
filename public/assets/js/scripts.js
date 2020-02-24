$(function() {

	const classifications = [
		{
			id: 1,
			value: "Security"
		},
		{
			id: 2,
			value: "Critical"
		}
	];
	const products = [
		{ id: 1, value: "Server 2019" },
		{ id: 2, value: "Server 2016" },
		{ id: 3, value: "Server 2012" },
		{ id: 4, value: "Windows 10 1803" },
		{ id: 5, value: "Windows 10 1903" },
		{ id: 6, value: "Office 2010" }
	];
	const statuses = [
		{ id: 1, value: "Unapproved" },
		{ id: 2, value: "Approved" },
		{ id: 3, value: "Declined" }
	];

	// takes select options list and outputs it to edit inputs
	// marks the currently selected option as selected in the edit form
	const getSelectOptions = function(selected, options) {
		let outStr = "";
		for ( let i = 0; i < options.length; i++ ) {
			if ( options[i].value == selected ) {
				outStr += '<option value="' + options[i].id +'" selected>' + options[i].value + '</option>'
			} else {
				outStr += '<option value="' + options[i].id + '">' + options[i].value + '</option>'
			}
		}
		return outStr;
	}

	// toggle .edit and .show 
	$(".editBtn").on("click", e => {
		e.preventDefault();
		// get row to update
		const uid = $(e.target).data("uid");
		const targetRow = $('#row' + uid);
		// get current values
		const kb = $('#kb' + uid).text();
		const classification = $('#classification' + uid).text();
		const status = $('#status' + uid).text();
		const details = $('#details' + uid).text();
		const product = $('#product' + uid).text();
		const url = $('#url' + uid).attr('href');
		const editEls = `
			<form id="${uid}">
				<td><input type="text" id="editKb${uid}" value="${kb}"></td>
				<td>
					<select id="editClassification${uid}">`+
					getSelectOptions(classification, classifications)+`
					</select>
				</td>
				<td>
					<select id="editStatus${uid}">`+
					getSelectOptions(status, statuses) +`
					</select>
				</td>
				<td><input id="editDetails${uid}" type="text" value="${details}"></td>
				<td>
					<select id="editProduct${uid}">`+
					getSelectOptions(product, products)+`
					</select>
				</td>
				<td><input id="editUrl${uid}" type="text" value="${url}"></td>
				<td><input type="submit" id="submitEditBtn" class="submitEditBtn" data-uid="${uid}" value="Send" /></td>
			</form>`;
		targetRow.html(editEls);
	});

	// handle update events
	$(document).on("click", ".submitEditBtn", e => {
		e.preventDefault();
		const uid = $(e.target).data('uid');
		const editUpdate = {};
		editUpdate.kb = $("#editKb" + uid).val();
		editUpdate.details = $("#editDetails" + uid).val();
		editUpdate.status = $("#editStatus" + uid).val();
		editUpdate.classification = $("#editClassification" + uid).val();
		editUpdate.product = $("#editProduct" + uid).val();
		editUpdate.url = $("#editUrl" + uid).val();
		editUpdate.uid = uid;
		$.ajax("/edit", {
			type: "POST",
			data: editUpdate
		}).then(() => {
			location.reload();
		})
	}) 
 
	$(".addBtn").on("click", e => {
		e.preventDefault();
		const newUpdate = {};
		newUpdate.kb = $("#addKb").val();
		newUpdate.classification = $("#addClassification").val();
		newUpdate.status = $("#addStatus").val();
		newUpdate.details = $("#addDetails").val();
		newUpdate.product = $("#addProduct").val();

		$.ajax("/add", {
			type: "POST",
			data: newUpdate
		}).then(() => {
			location.reload();
		});
	});

});
