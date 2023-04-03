import React, { useState } from 'react';
import { Tooltip } from 'reactstrap';
import { useSelector } from 'react-redux';
import { ButtonWithAuthz } from 'asab-webui';
import { useTranslation } from "react-i18next";

export const ActionButton = ({ label, onClick, icon, id, disabled=false,
	color="", outline=false }) => {

	const [tooltipOpen, setTooltipOpen] = useState(false);
	const resource = "asab:service:manage";
	const resources = useSelector(state => state.auth?.resources);

	const toggle = () => setTooltipOpen(!tooltipOpen);
	const title = () => `${label.split(' ')[0]}`;

	return (
		<React.Fragment>
			<ButtonWithAuthz
				aria-label={label}
				id={id}
				color={color}
				onClick={onClick}
				disabled={disabled}
				outline={outline}
				resource={resource}
				resources={resources}
			>
				<i className={icon}></i>
			</ButtonWithAuthz>
			<Tooltip
				placement="top"
				isOpen={tooltipOpen}
				target={id}
				toggle={toggle}
			>
				{title()}
			</Tooltip>
		</React.Fragment>
	)
}

export const ActionIcon = ({ label, onClick, icon, id, disabled=false }) => {
	const { t } = useTranslation();
	const [tooltipOpen, setTooltipOpen] = useState(false);
	const resource = "asab:service:manage";
	const resources = useSelector(state => state.auth?.resources);

	const toggle = () => setTooltipOpen(!tooltipOpen);
	const title = () => `${label.split(' ')[0]}`;

	// Check if user has a rights to perform an action
	const resourceCheck = (resources.indexOf(resource) == -1 && resources.indexOf("authz:superuser") == -1);

	return (
		<React.Fragment>
			{((disabled == true) || (resourceCheck == true)) ?
				<i
					title={resourceCheck && t("You do not have access rights to perform this action")}
					aria-label={label}
					id={id}
					className={`action-icon-disabled pl-1 pr-1 ${icon}`}
				></i>
				:
				<i
					aria-label={label}
					id={id}
					className={`action-icon pl-1 pr-1 ${icon}`}
					onClick={onClick}
				></i>
			}
			<Tooltip
				placement="bottom"
				isOpen={tooltipOpen}
				target={id}
				toggle={toggle}
			>
				{title()}
			</Tooltip>
		</React.Fragment>
	)
}
