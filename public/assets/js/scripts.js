$(function () {


	// Check uri for filter or sort values so we can 
	// include them in a GET request
	const parseUriParams = (paramType) => {
		const paramString = window.location.search;
		const urlParams = new URLSearchParams(paramString);
		if (urlParams.has(paramType + 'Col')) {
			let paramObj = {};
			eval("paramObj." + paramType + "Col = urlParams.get('"+ paramType + "Col')"); 
			eval("paramObj." + paramType + "Val = urlParams.get('"+ paramType + "Val')");	
			return paramObj;
		} else { return null; }
	}


	// user clicks td element, get sibling td elements and change their class
	const selectRow = function (target) {
		const siblings = target.siblings("td");
		$(".selectedRow").removeClass("selectedRow");
		target.addClass("selectedRow");
		siblings.addClass("selectedRow");
	};

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

	// EDIT HANDLERS AND HELPER FUNCTIONS
	
	// Hard coding values of products, classifications, and statuses for now
	// TODO: get these dynamically from database so I only need to change them at one place
	const products = [
		{ id: 1, value: "Server 2019" },
		{ id: 2, value: "Server 2016" },
		{ id: 3, value: "Server 2012" },
		{ id: 4, value: "Server 2012 R2" },
		{ id: 5, value: "Server 2008" },
		{ id: 6, value: "Server 2008 R2" },
		{ id: 7, value: "Windows 10 1607" },
		{ id: 8, value: "Windows 10 1709" },
		{ id: 9, value: "Windows 10 1803" },
		{ id: 10, value:"Windows 10 1903" },
		{ id: 11, value:"Windows 7" },
		{ id: 12, value:"Office 2010" },
		{ id: 13, value:"Office 2013" },
	];

	const statuses = [
		{ id: 1, value: "Unapproved" },
		{ id: 2, value: "Approved" },
		{ id: 3, value: "Declined" },
		{ id: 4, value: "Superseded" },
	];

	const classifications = [
		{ id: 1, value: "Security" },
		{ id: 2, value: "Critical" },
		{ id: 3, value: "Updates" },
		{ id: 4, value: "Upgrades" },
	]
	
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

	// gets id and value from data-id and value of each option in the indicated select input
	const getSelectObjects = (columnName) => {
		console.log('scriptjs getSelectObjects for col: ' + columnName);
	}

	// Edit button event handler
	// TODO:
	// need to get the id field from classification, product, and status tables
	// in an object array so we can match them with the selected values and populate select menus
	$(".editBtn").on("click", (e) => {
		e.preventDefault();
		console.log("script on click editbtn");
		// loop through select columns and get data-id and values and store them in separate object arrays...active-icon-cell
		//const products = getSelectObjects("product");
		//const classifications = getSelectObjects("classification");
		//const statuses = getSelectObjects("status");
		// get row to update
		const uid = $(e.target).data("uid");
		const targetRow = $("#row" + uid);
		// get current values from the row
		const kbVal = $("#kb" + uid)
			.text()
			.trim();
		const classificationVal = $("#classification" + uid)
			.text()
			.trim();
		const statusVal = $("#status" + uid)
			.text()
			.trim();
		const detailsVal = $("#details" + uid + "-info")
			.text()
			.trim();
		const productVal = $("#product" + uid)
			.text()
			.trim();
		const publishDate = $("#publishDate" + uid)
			.text()
			.trim();
		const researchDate = $("#researchDate" + uid)
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
				<td class="selectedRow"><input type="text" id="editKb${uid}" class="selectedRow" value="${kbVal}"></td>
				<td class="selectedRow">
					<select id="editClassification${uid}"  class="selectedRow">` +
					getSelectOptions(classificationVal, classifications) +
					`</select>
				</td>
				<td class="selectedRow">
					<select id="editStatus${uid}" class="selectedRow">` +
					getSelectOptions(statusVal, statuses) +
					`</select>
				</td>
				<td class="selectedRow">
					<select id="editProduct${uid}" class="selectedRow">` +
						getSelectOptions(productVal, products) +
					`</select>
				</td>
				<td class="selectedRow"><input id="editPublishDate${uid}" class="selectedRow" type="text" value="${publishDate}"></td>
				<td class="selectedRow">${researchDate}</td>
				<td class="selectedRow"><input id="editDetails${uid}" class="selectedRow" type="text" value="${detailsVal}"></td>
				${url}
				<td class="selectedRow"><input type="submit" id="submitEditBtn" data-uid="${uid}" value="Send" /></td>
			</form>`;
		targetRow.html(editEls);
	});

	// handle keypresses when in edit mode
	// submit on Enter, exit on Esc, and edit on anything else.
	$(document).on("keypress", ".selectedRow", (e) => {
		e.preventDefault();
		e.stopPropagation();
		const uid = $("#submitEditBtn").data("uid");
		if (e.code == "Enter") {
			updateRow(uid);
		} else {
			e.target.value += e.key;
		}
	});

	// Handle edit form submission
	$(document).on("click", "#submitEditBtn", (e) => {
		e.preventDefault();
		updateRow($(e.target).data("uid"));
	});
	
	updateRow = (uid) => {
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
	// END EDIT EVENTS

	$(".sortImg").on("click", (e) => {
		e.preventDefault();
		
		// set default sort direction
		let direction;
		let uriString = "?";
		// get filter parameter if set
		const filterObj = parseUriParams("filter");
		
		// Set sort direction depending on current class
		if ($(e.target).hasClass("desc")) {
			direction = "desc";
		} else if ($(e.target).hasClass("asc")) {
			direction = "asc";
		} else {
			$(e.target).addClass("desc");
		}
		// default sort is asc
		if (typeof direction === "undefined") direction = "asc";
		// put sort parameters in query object
		queryObj = {
			sortCol: $(e.target).data("col"),
			sortVal: direction
		};
		uriString += "sortCol=" + queryObj.sortCol + "&sortVal=" + queryObj.sortVal;
		if ( filterObj ) {
			queryObj.filterCol = filterObj.filterCol;
			queryObj.filterVal = filterObj.filterVal;
			uriString += "&filterCol=" + queryObj.filterCol + "&filterVal=" + queryObj.filterVal;
		}
		$.ajax("/", {
			type: "GET",
			data: queryObj
		}).then(() => {
			location.href = uriString;
		});
	});

	// check and hide elements that don't contain the desired value
	$(".filterSelect").on("change", (e) => {
		e.preventDefault();
		let uriString = "?";
		// value to filter by
		const filterValue = $(e.target).val().toLowerCase();
		const filterColumn = $(e.target).attr('id').split('-')[1].toLowerCase();
		const queryObj = {
			filterCol: filterColumn,
			filterVal: filterValue
		}
		uriString += "filterCol="+queryObj.filterCol+"&filterVal="+queryObj.filterVal;
		// get sort parameter if set
		const sortObj = parseUriParams("sort");
		if ( sortObj ) {
			queryObj.sortCol = sortObj.sortCol;
			queryObj.sortVal = sortObj.sortVal;
			uriString += "&sortCol=" + queryObj.sortCol + "&sortVal=" + queryObj.sortVal;
		}
		$.ajax("/", {
			type: "GET",
			data: queryObj
		}).then(result => {
			location.href = uriString;
		});
	});

	// Submit search when button is clicked.
	$('#searchBtn').on("click", e => {
		let uriString = "?";
		const queryObj = {
			filterCol: "u.kb",
			filterVal: $('#search').val() + '%'
		}
		console.log(queryObj);
		$.ajax("/", {
			type: "GET",
			data: queryObj
		}).then(result => {
			uriString += "filterCol=u.kb&filterVal="+$("#search").val();
			location.href = uriString;
			
		})
	});

	// Dynamic search as input is filled in...under construction!
	$('#search').on("input", e => {
		let uriString = "?";
		const queryObj = {
			filterCol: "u.kb",
			filterVal: $('#search').val() + '%'
		}
		console.log(queryObj);
		$.ajax("/search", {
			type: "GET",
			data: queryObj
		}).then(result => {
			console.log('search result = ');
			console.log(result);
			uriString += "filterCol=u.kb&filterVal="+$("#search").val();
			//location.href = uriString;
		})
	});

	// toggle details row
	$(".active-icon, .active-icon-cell").on("click", e => {
		e.stopImmediatePropagation() // prevents event bubbling up to parent when triggered by child element
		$("#" + $(e.target).data("id") + "-row").toggle();
	})

});
