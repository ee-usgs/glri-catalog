<%String username = request.getUserPrincipal() != null ? request.getUserPrincipal().getName() : ""; %>

<div class="col-sm-12 col-xs-12" ng-controller="ProjectCtrl" ng-if="nav.isBasePath('Projects')">
	<div class="row">
		<div class="col-xs-12">
			<h2 class="detailTitle">Project Information Form</h2>
		</div>
	</div>
	<div class="row">
		<div class="col-xs-12">
			<div class="alert alert-info">
				<p>
					Information entered in this form will be displayed in the <a
						href="http://cida.usgs.gov/glri/" class="alert-link"
						target="_blank">USGS GLRI Website</a>.
				</p>
				<p>
					You are logged in as <strong><%=username%></strong>.
					<a href="logout.jsp" class="alert-link">Logout</a> to sign in as a
					different user, but you must be signed in with a valid AD account
					to use this form.
				</p>
			</div>
		</div>
	</div>

	<div class="row">
		<div id="contentBrowseDetail" class="col-xs-12" ng-if="!loading">
	
			<form id="newProjectForm" name="newProjectForm" ng-submit="save()">
	
				<div class="form-msg" id="form-msg-required">Please complete
					this required field.</div>
				<div class="form-msg" id="form-msg-validate">{{validation.singleMsg}}</div>
				<div class="form-msg" id="form-msg-agree">You must agree to the
					Data Management Plan in order to submit a new GLRI Project.</div>
	
				<span class="form-spacing form-optional"
					style="margin-bottom: 15px; display: block;">Note: Fields
					with this background are the only optional entries.</span>
	
				<div>
					<h4 class="">Data Management Plan</h4>
					<div class="form-spacing" style="margin-left: 10px;">
						I will create a data management plan within the first year of the
						project, and will ensure that metadata for all data sets is created
						in a timely manner. (Note: this is required for all GLRI funded
						projects. More information about USGS data management plans can be
						found <a href="http://www.usgs.gov/datamanagement/plan/dmplans.php"
							target="_blank">here</a>). <select
							class="select2 form-control form-required" id="dmPlan"
							ng-model="project.dmPlan">
							<option value="agree">I Agree</option>
							<option value="disagree">I Disagree</option>
						</select>
					</div>
				</div>
	
				<div>
					<input type="hidden" ng-model="project.username"
						ng-init="project.username = '<%=username%>'" />
				</div>
	
				<div>
					<h4 class="">Project Title</h4>
					<div class="form-spacing">
						Enter the project title as it should appear on the GLRI website.
						(Basis Task field: Task Title)
						<textarea class="form-control form-title form-required"
							ng-model="project.title"></textarea>
					</div>
				</div>
	
				<div>
					<h4 class="">Image URL</h4>
					<div class="form-spacing">
						Enter the publicly accessible URL to image to be used in the the
						project page on the GLRI website. <input
							class="form-control form-field form-optional single-url"
							type="text" ng-model="project.image">
						<div class="proj-img-container">
						If valid, the image at the specified URL should be displayed:
						<br/><br/>
						<img ng-src="{{project.image}}"/>
						</div>
					</div>
				</div>
	
				<div>
					<div class="input-daterange">
						<div class="datepickerStart"
							style="width: 50% !important; float: left;">
							<h4 class="">Agreement Start Date</h4>
							Required: Calendar Year (yyyy) or Full Date (yyyy-mm-dd)
							<div class="form-spacing startDate">
								<input type="text"
									class="form-control form-control form-field form-date form-required"
									style="width: 150px !important;" uib-datepicker-popup
									model="project.startDate" ng-model="project.startDateNg"
									is-open="status.showStart" datepicker-options="dateOptions"
									date-disabled="disabled(date, mode)" ng-required="false"
									close-text="Close" datepicker-mode="status.mode" />
								<div class="input-group-addon calendar-button"
									ng-click="showCalendar('start')">
									<span class="glyphicon glyphicon-calendar"></span>
								</div>
							</div>
						</div>
						<div class="datepickerFinish"
							style="width: 50% !important; float: right;">
							<h4 class="">Agreement End Date</h4>
							Optional: Calendar Year (yyyy) or Full Date (yyyy-mm-dd)
							<div class="form-spacing endDate">
								<input type="text"
									class="form-control form-control form-field form-date form-optional"
									style="width: 150px !important;" uib-datepicker-popup
									model="project.endDate" ng-model="project.startDateNg"
									is-open="status.showFinish" datepicker-options="dateOptions"
									date-disabled="disabled(date, mode)" ng-required="false"
									close-text="Close" datepicker-mode="status.mode" />
								<div class="input-group-addon calendar-button"
									ng-click="showCalendar('finish')">
									<span class="glyphicon glyphicon-calendar"></span>
								</div>
							</div>
						</div>
						<div style="clear: both;"></div>
					</div>
				</div>
	
				<div>
					<h4 class="">Project Duration</h4>
					<div class="form-spacing" style="margin-left: 10px;">
						Choose One. <select class="select2 form-control form-required"
							id="duration" ng-model="project.duration">
							<option>Single effort (1 year or less)</option>
							<option>Short term (2 to 5 years)</option>
							<option>Long term (greater than 5 years)</option>
						</select>
					</div>
				</div>
	
				<div>
					<h4>Primary Focus Area</h4>
					<div class="form-spacing" style="margin-left: 10px;">
						Choose One. <select class="select2 form-control form-required"
							id="focus_area" ng-model="project.focusArea">
						</select>
					</div>
				</div>
	
				<div>
					<h4 class="">Project Status</h4>
					<div class="form-spacing" style="margin-left: 10px;">
						Choose One. <select class="select2 form-control form-required"
							id="project_status" ng-model="project.status">
							<option value="Completed">Completed</option>
							<option value="In Progress">In Progress</option>
						</select>
					</div>
				</div>
	
				<div>
					<h4 class="">Entry Type</h4>
					<div class="form-spacing" style="margin-left: 10px;">
						Choose One. <select class="select2 form-control form-required"
							id="entry_type" ng-model="project.entryType">
							<option>New Project</option>
							<option>Project Update</option>
						</select>
					</div>
				</div>
	
				<div>
					<h4 class="">Spatial Location</h4>
					<div class="form-spacing" style="margin-left: 10px;">
						Indicates if the project has geospatial footprint(s). Select "No"
						for projects that do not relate to a geographic area (e.g.
						overhead, lab analysis, software development or science support). <select
							class="select2 form-control form-required" id="spatial"
							ng-model="project.spatial">
							<option value="Has Spatial">Has Spatial</option>
							<option value="No Spatial">No Spatial</option>
						</select>
					</div>
				</div>
	
				<div>
					<h4>Background/Problem</h4>
					<div class="background form-spacing">
						Brief statement of the problem that the project/task will address.
						(Basis Task field: Summary Narratives, Statement of Problem)
						<textarea class="form-control form-field form-required" rows="10"
							ng-model="project.purpose"></textarea>
					</div>
				</div>
	
				<div>
					<h4>Objectives</h4>
					<div class="background form-spacing">
						Summary of the overall plans, objectives, and approach of the
						Project or Task. Describe the issues to be addressed, and if
						applicable, the scientific questions and policy issues addressed.
						(Basis Task field: Summary Narratives, Objectives)
						<textarea class="form-control form-field form-required" rows="10"
							ng-model="project.objectives"></textarea>
					</div>
				</div>
	
				<div>
					<h4>Description of Work</h4>
					<div class="form-spacing">
						Short paragraph to briefly describe the work to be done this FY.
						(Basis Task field: Annual Narratives, Statement of Work)
						<textarea class="form-control form-field form-required" rows="10"
							ng-model="project.work"></textarea>
					</div>
				</div>
	
				<div>
					<h4>Relevance and Impact</h4>
					<div class="form-spacing">
						A 'narrative' description of the expected outcomes, pertinence to
						policy and scientific issues, and Program relevance of the project.
						Required, except for projects of type 'Support'.
						<textarea class="form-control form-field form-optional" rows="10"
							ng-model="project.impact"></textarea>
					</div>
				</div>
	
				<div>
					<h4>Planned Products</h4>
					<div class="form-spacing">
						Describe anticipated products from this project (e.g. publication
						or data set), providing a title and outlet for each product. (Basis
						Task field: Products)
						<textarea class="form-control form-field form-required" rows="10"
							ng-model="project.product"></textarea>
					</div>
				</div>
	
				<div>
					<h4>Template(s)</h4>
					<div class="form-spacing">
						<ui-select multiple ng-model="project.templates"
							style="width:100%" class="form-required"> <ui-select-match
							placeholder="Check all that apply.">{{$item.display}}</ui-select-match>
						<ui-select-choices
							repeat="template in transient.templates | orderBy:'sort'">
						{{template.display}} </ui-select-choices> </ui-select>
					</div>
				</div>
	
				<div>
					<h4>SiGL Keyword(s)</h4>
					<div class="form-spacing">
						<ui-select multiple ng-model="project.SiGL" style="width:100%"
							class="form-required"> <ui-select-match
							placeholder="Check all that apply.">{{$item.display}}</ui-select-match>
						<ui-select-choices
							repeat="SiGL in transient.SiGL_keywords | orderBy:'sort'">
						{{SiGL.display}} </ui-select-choices> </ui-select>
					</div>
				</div>
	
				<div>
					<h4>Water Feature(s)</h4>
					<div class="form-spacing">
						<ui-select multiple ng-model="project.water" style="width:100%"
							class="form-required"> <ui-select-match
							placeholder="Check all that apply.">{{$item.display}}</ui-select-match>
						<ui-select-choices
							repeat="water in transient.water_features | orderBy:'sort'">
						{{water.display}} </ui-select-choices> </ui-select>
					</div>
				</div>
	
				<div>
					<h4>GLRI Keyword(s)</h4>
					<div class="form-spacing">
						<textarea class="form-control form-field form-required" rows="5"
							ng-model="project.keywords"
							placeholder="Enter a comma separated list of keywords or phrases. Example: &#10;forecasting, wetlands ecology, coastal"></textarea>
					</div>
				</div>
	
				<div>
					<h4 class="">Principal Investigator</h4>
					<div class="form-spacing">
						Lead PI for the project. (Basis Task field: Leaders, Task Leader) <input
							type="text"
							class="form-control form-field form-required contact single-person"
							ng-model="project.principal"
							placeholder="Enter the name and email address for a single person. Both are required. Example: Jane Doe jdoe@usgs.gov">
					</div>
				</div>
	
				<div>
					<h4 class="">Associate Project Chief</h4>
					<div class="form-spacing">
						Center Director, Office Chief, Regional Staff Member, etc. (Basis
						Task field: Leaders,Task Leader) <input type="text"
							class="form-control form-field form-required contact single-person"
							ng-model="project.chief"
							placeholder="Enter the name and email address for a single person. Both are required. Example: Jane Doe jdoe@usgs.gov">
					</div>
				</div>
	
				<div>
					<h4>Cooperating Organization</h4>
					<div class="point-of-contact form-spacing">
						This is used to identify significant relationships between the
						project and organizations outside of USGS that participate in or
						use information from the project. External Organizations may
						include Federal entities, State, County, and Municipal governmental
						organizations, tribal entities, academic organizations, private
						organizations, international entities, and non&#45;governmental
						organizations.
						<textarea
							class="form-control form-field form-optional contact multi-organization"
							rows="5" ng-model="project.organizations"
							placeholder="Enter a comma separated list of organizations.  Each organization must have a name and optionally an email address. Example: &#10;Cooperating Org, Environmental Org info@environment.org"></textarea>
					</div>
				</div>
	
				<div>
					<h4>Points of Contact</h4>
					<div class="point-of-contact form-spacing">
						<textarea
							class="form-control form-field form-optional contact multi-person"
							rows="5" ng-model="project.contacts"
							placeholder="Enter a comma separated list of 'people' contacts for the project.  Each contact must have a name and email. Example: &#10;Jane Doe jdoe@usgs.gov, James Brown jbrown@usgs.gov"></textarea>
					</div>
				</div>
	
				<div>
					<p class="form-spacing">
						<button id="discard" class="btn btn-primary pull-left"
							ng-click="discard()">Discard</button>
						<button id="save" type="submit" class="btn btn-primary pull-right">Save</button>
					</p>
				</div>
	
			</form>
		</div>
	</div>

	<div class="row">
		<div id="projectFormLoadingMessage" class="col-xs-12"  ng-if="loading">
			Fetching project for editing...
		</div>
	</div>
</div>
