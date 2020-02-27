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
	const getSelectOptions = function(selectedOpt, optionsArr) {
		let outStr = "";
		for (let i = 0; i < optionsArr.length; i++) {
			if (optionsArr[i].value == selectedOpt) {
				outStr +=
					'<option value="' +
					optionsArr[i].id +
					'" selected>' +
					optionsArr[i].value +
					"</option>";
			} else {
				outStr +=
					'<option value="' + optionsArr[i].id + '">' + optionsArr[i].value + "</option>";
			}
		}
		return outStr;
	};

	// user clicks td element, get sibling td elements and change their class
	const selectRow = function(target) {
		const siblings = target.siblings("td");
		$(".selectedRow").removeClass("selectedRow");
		target.addClass("selectedRow");
		siblings.addClass("selectedRow");
	};

	// toggle .edit and .show
	$(".editBtn").on("click", e => {
		e.preventDefault();
		// get row to update
		const uid = $(e.target).data("uid");
		const targetRow = $("#row" + uid);
		// get current values
		const kb = $("#kb" + uid)
			.text()
			.trim();
		const classification = $("#classification" + uid)
			.text()
			.trim();
		const status = $("#status" + uid)
			.text()
			.trim();
		const details = $("#details" + uid)
			.text()
			.trim();
		const product = $("#product" + uid)
			.text()
			.trim();
		const publishDate = $("#publishDate" + uid)
			.text()
			.trim();
		const href = $("#url" + uid).attr("href");
		if (typeof href != "undefined") {
			var url =
				'<td class="selectedRow"><input id="editUrl${uid}" class="selectedRow" type="text" value="${href}"></td>';
		} else {
			var url =
				'<td class="selectedRow"><input id="editUrl${uid}" class="selectedRow" type="text" value=""></td>';
		}
		const editEls =
			`<form id="${uid}" class="editForm">
				<td class="selectedRow"><input type="text" id="editKb${uid}" class="selectedRow" value="${kb}"></td>
				<td class="selectedRow">
					<select id="editClassification${uid}"  class="selectedRow">` +
			getSelectOptions(classification, classifications) +
			`</select>
				</td>
				<td class="selectedRow">
					<select id="editStatus${uid}" class="selectedRow">` +
			getSelectOptions(status, statuses) +
			`</select>
				</td>
				<td class="selectedRow"><input id="editDetails${uid}" class="selectedRow" type="text" value="${details}"></td>
				<td class="selectedRow">
					<select id="editProduct${uid}" class="selectedRow">` +
			getSelectOptions(product, products) +
			`</select>
				</td>
				<td class="selectedRow"><input id="editPublishDate${uid}" class="selectedRow" type="text" value="${publishDate}"></td>
				${url}
				<td class="selectedRow"><input type="submit" id="submitEditBtn" class="submitEditBtn" data-uid="${uid}" value="Send" /></td>
			</form>`;
		targetRow.html(editEls);
	});

	$(".sortImg").on("click", e => {
		e.preventDefault();
		// set default sort direction
		let direction;
		if ($(e.target).hasClass("desc")) {
			direction = "desc";
		} else if ($(e.target).hasClass("asc")) {
			direction = "asc";
		} else {
			$(e.target).addClass("desc");
		}
		if (typeof direction === "undefined") direction = "asc";
		$.ajax("/sort/" + $(e.target).data("col") + "/" + direction, {
			type: "GET"
		}).then(response => {
			location.href = "/sort/" + $(e.target).data("col") + "/" + direction;
		});
	});

	/* $("td").on("click", e => {
		e.preventDefault();
		selectRow($(e.target));
	}); */

	// handle update events
	$(document).on("click", ".submitEditBtn", e => {
		e.preventDefault();
		const uid = $(e.target).data("uid");
		const editUpdate = {};
		editUpdate.kb = $("#editKb" + uid).val();
		editUpdate.details = $("#editDetails" + uid).val();
		editUpdate.status = $("#editStatus" + uid).val();
		editUpdate.classification = $("#editClassification" + uid).val();
		editUpdate.product = $("#editProduct" + uid).val();
		editUpdate.publishDate = $("#editPublishDate" + uid).val();
		editUpdate.url = $("#editUrl" + uid).val();
		editUpdate.uid = uid;
		$.ajax("/edit", {
			type: "POST",
			data: editUpdate
		}).then(() => {
			location.reload();
		});
	});

	$(".addBtn").on("click", e => {
		e.preventDefault();
		const newUpdate = {};
		newUpdate.kb = $("#addKb").val();
		newUpdate.classification = $("#addClassification").val();
		newUpdate.status = $("#addStatus").val();
		newUpdate.details = $("#addDetails").val();
		newUpdate.product = $("#addProduct").val();
		newUpdate.publishDate = $("#addPublishDate").val();
		newUpdate.url = $("#addUrl").val();
		$.ajax("/add", {
			type: "POST",
			data: newUpdate
		}).then(() => {
			location.reload();
		});
	});
});
