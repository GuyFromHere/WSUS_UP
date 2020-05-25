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

	// check  and hide elements that don't contain the desired value
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
			console.log('search result = ');
			console.log(result);
			uriString += "filterCol=u.kb&filterVal="+$("#search").val();
			location.href = uriString;
			
		})

	})
});
