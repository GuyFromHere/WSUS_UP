$(function () {
	const classifications = [
		{
			id: 1,
			value: "Security",
		},
		{
			id: 2,
			value: "Critical",
		},
	];
	const products = [
		{ id: 1, value: "Server 2019" },
		{ id: 2, value: "Server 2016" },
		{ id: 3, value: "Server 2012" },
		{ id: 4, value: "Windows 10 1803" },
		{ id: 5, value: "Windows 10 1903" },
		{ id: 6, value: "Office 2010" },
		{ id: 7, value: "Office 2013" },
		{ id: 8, value: "Windows 7" },
		{ id: 9, value: "Server 2008" },
		{ id: 10, value: "Windows 10 1607" },
		{ id: 11, value: "Windows 10 1709" },
	];
	const statuses = [
		{ id: 1, value: "Unapproved" },
		{ id: 2, value: "Approved" },
		{ id: 3, value: "Declined" },
	];

	// takes select options list and outputs it to edit inputs
	// marks the currently selected option as selected in the edit form
	const getSelectOptions = function (selectedOpt, optionsArr) {
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

	// get values of cells in the selected row
	const getRowValues = (rowId) => {
		// get current values
		const kb = $("#kb" + rowId)
			.text()
			.trim();
		const classification = $("#classification" + rowId)
			.text()
			.trim();
		const status = $("#status" + rowId)
			.text()
			.trim();
		const details = $("#details" + rowId)
			.text()
			.trim();
		const product = $("#product" + rowId)
			.text()
			.trim();
		const publishDate = $("#publishDate" + rowId)
			.text()
			.trim();
		const href = $("#url" + rowId).attr("href");
	};

	// user clicks td element, get sibling td elements and change their class
	const selectRow = function (target) {
		const siblings = target.siblings("td");
		$(".selectedRow").removeClass("selectedRow");
		target.addClass("selectedRow");
		siblings.addClass("selectedRow");
	};

	// toggle .edit and .show
	$(".editBtn").on("click", (e) => {
		e.preventDefault();
		console.log("script on click editbtn");
		// get row to update
		const uid = $(e.target).data("uid");
		const targetRow = $("#row" + uid);
		// get any other .selectedRow and escape it
		//console.log("scripts editBtn click");
		//exitEditMode();
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
			var url = `<td class="selectedRow"><input id="editUrl${uid}" class="selectedRow" type="text" value="${href}"></td>`;
		} else {
			var url = `<td class="selectedRow"><input id="editUrl${uid}" class="selectedRow" type="text" value=""></td>`;
		}
		// insert form in place of the target row
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
				<td class="selectedRow"><input type="submit" id="submitEditBtn" data-uid="${uid}" value="Send" /></td>
			</form>`;
		targetRow.html(editEls);
	});

	$(".sortImg").on("click", (e) => {
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
			type: "GET",
		}).then(() => {
			location.href = "/sort/" + $(e.target).data("col") + "/" + direction;
		});
	});

	/* $("td").on("click", e => {
		e.preventDefault();
		selectRow($(e.target));
	}); */

	// handle update events
	$(document).on("click", ".submitEditBtn", (e) => {
		e.preventDefault();
		console.log("script on click edit");
		updateRow($(e.target).data("uid"));
	});

	exitEditMode = (uid) => {
		// find #submitEditBtn and get row ID
		//const uid = $("#submitEditBtn").data("uid");
		const targetRow = $(`#row${uid}`);
		console.log("exitEditMode uid = ");
		console.log(uid);
		// get values of items in the selected row so we can store them in normal TDs
		// get current values in cells
		const kb = $(`#editKb${uid}`).val().trim();
		console.log("kb = ");
		console.log(kb);
		const classification = $(`#editClassification${uid} option:selected`).text();
		const status = $(`#editStatus${uid} option:selected`).text();
		const details = $(`#editDetails${uid}`).text().trim();
		const product = $(`#editProduct${uid} option:selected`).text();
		const publishDate = $(`#editPublishDate${uid}`).val().trim();
		const href = $(`#editUrl${uid}`).val().trim();
		if (typeof href != "undefined") {
			var url = `<td class="updateInfo"><a href=${href} id="url${uid}" target="_blank">Link</a></td>`;
		} else {
			var url = `<td class="updateInfo"></td>`;
		}
		// insert form in place of the target row
		const showEls = `<td id="kb${uid}" class="updateInfo">${kb}</td>
			<td id="classification${uid}" class="updateInfo">${classification}</td>
			<td id="status${uid}" class="updateInfo">${status}</td>
			<td id="details${uid}" class="updateInfo">${details}</td>
			<td id="product${uid}" class="updateInfo">${product}</td>
			<td id="publishDate${uid} class="updateInfo">${publishDate}</td>
				${url}
			<td><input type="submit" id="editBtn" data-uid="${uid}" value="ExitedEdit${uid}" /></td>`;
		console.log("scripts exitEditMode");
		console.log(showEls);
		targetRow.html(showEls);
	};

	updateRow = (uid) => {
		console.log("scripts updateRow");
		console.log(uid);
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
			data: editUpdate,
		}).then(() => {
			location.reload();
		});
	};

	// handle enter and esc keypresses when editing a row
	$(document).on("keydown", ".selectedRow", (e) => {
		e.preventDefault();
		e.stopPropagation();
		const uid = $("#submitEditBtn").data("uid");
		if (e.code == "Enter") {
			console.log("Call keypress handler escape -> updateRow " + uid);
			updateRow(uid);
		}
		if (e.code == "Escape") {
			console.log("Call keypress handler escape -> exitEditMode " + uid);
			exitEditMode(uid);
		}
	});

	// Get new update info and post to /add
	$(".addBtn").on("click", (e) => {
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
			data: newUpdate,
		}).then(() => {
			location.reload();
		});
	});

	// filter for selected status.
	// obvs need to account for the current sort values....
	$("#navStatusSelect").on("change", (e) => {
		e.preventDefault();
		const selectedStatus = $(e.target).val();
		// get current url so we can pass sort values to route
		const pathParams = window.location.pathname;
		const path = pathParams.split("/");
		console.log("scripts navstatusselect selected:");
		console.log(selectedStatus);
		console.log("scrips navstatus select path params");
		console.log(pathParams + "/" + selectedStatus);
		$.ajax(pathParams + selectedStatus, {
			type: "GET",
		}).then(() => {
			location.href = pathParams + selectedStatus;
		});
	});
});
