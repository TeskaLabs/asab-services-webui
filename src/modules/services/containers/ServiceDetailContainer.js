import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import ReactJson from 'react-json-view';
import { useSelector } from 'react-redux';

import { Container, Card, CardBody, CardHeader, Table,
	InputGroup, InputGroupText, Input, InputGroupAddon,
	ButtonGroup, Button
} from 'reactstrap';

import { CellContentLoader } from 'asab-webui';

// import ActionButton from "./components/ActionButton";

export default function ServiceDetailContainer(props) {
	const { t } = useTranslation();

	const [ consoleContent, setConsoleConent ] = useState([]);

	return(
		<Container className="svcs-container service-detail-wrapper" fluid>
			<Card className="service-detail-changelog">
				<CardHeader className="border-bottom">
					<div className="card-header-title">
						<i className="cil-description pr-2"></i>
						{t("ASABServices|Changelog")}
					</div>
				</CardHeader>
			</Card>
			<Card className="service-detail-info">
				<CardHeader className="border-bottom">
					<div className="card-header-title">
						<i className="cil-info pr-2"></i>
						{t("ASABServices|Info")}
					</div>
				</CardHeader>
			</Card>
			<Card className="service-detail-terminal">
				<CardHeader className="border-bottom">
					<div className="card-header-title">
						<i className="cil-terminal pr-2"></i>
						{t("ASABServices|Terminal")}
					</div>
				</CardHeader>
				<CardBody className="log-console">
					<Table size="sm" borderless>
						{/*<colgroup>
							<col style={{ width: "14em" }} />
							<col style={{ width: "3.5em" }} />
						</colgroup>*/}
						<tbody className="text-monospace console-body">
							{/*TODO: remove test lines*/}
							<tr><td>{"AHOJ JOHA"}</td></tr>
							<tr><td>{"Some content long content very very long long very very long long very very long"}</td></tr>
							{/*-----*/}
							{consoleContent.map((line, idx) => {
								return (
									<tr key={idx}>
										<td>{line.c}</td>
										{/*<td style={{ whiteSpace: "nowrap" }}>{line.t}</td>
										<td style={{ whiteSpace: "nowrap" }}>{line.L}</td>
										<td>
											{(line.M != undefined) ?
												<pre style={{ color: "inherit", fontSize: "inherit", margin: "0" }}>{line.M}</pre> : null
											}
											{(line.sd != undefined) ?
												<span>{JSON.stringify(line.sd)}</span> : null
											}
										</td>
										<td style={{ whiteSpace: "nowrap" }}>{line.C}</td>*/}
									</tr>
								)
							})}
						</tbody>
					</Table>
				</CardBody>
			</Card>
		</Container>
	)
}