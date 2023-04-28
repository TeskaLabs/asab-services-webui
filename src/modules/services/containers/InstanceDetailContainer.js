import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import ReactJson from 'react-json-view';
import { useSelector } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw'
import { useLocation } from 'react-router-dom';

import { Container, Card, CardBody, CardHeader, Table,
	InputGroup, InputGroupText, Input, InputGroupAddon,
	ButtonGroup, Button
} from 'reactstrap';

import { CellContentLoader } from 'asab-webui';

import { ActionButton } from "./components/ActionButton";

export default function InstanceDetailContainer(props) {
	const { t } = useTranslation();
	const location = useLocation();

	const [ consoleContent, setConsoleConent ] = useState([]);
	const [ changelogContent, setChangelogConent ] = useState("");
	const [ changelogLoading, setChangelogLoading ] = useState(true);
	const [ metricsLoading, setMetricsLoading ] = useState(true);

	// const ASABRemoteControlAPI = props.app.axiosCreate('asab-remote-control');


	// Extract service name from location
	const instanceID = useMemo(() => {
		if (location.pathname) {
			// TODO: transform dashes to underscore for dynamic instance inputs (ikdyz mozna ne)
			const svc = location.pathname.replace("/services/instance/", "");
			return svc;
		}
		return undefined;
	}, [location])

	// asab_library_1
	const InstanceServiceAPI = instanceID ? props.app.axiosCreate(instanceID) : "";

	useEffect(() => {
		if (instanceID) {
			obtainChangelog();
			obtainMetrics();
		}
	}, [instanceID])

	// Obtain changelog
	const obtainChangelog = async () => {
		try {
			let response = await InstanceServiceAPI.get(`/asab/v1/changelog`);
			console.log(response, "RESPONSE")
			setChangelogConent(response.data);
		} catch(e) {
			console.error(e);
		}
		setChangelogLoading(false);
	}

	// Obtain metrics
	const obtainMetrics = async () => {
		try {
			let response = await InstanceServiceAPI.get(`/asab/v1/metrics.json`);
			console.log(response, "RESPONSE")
		} catch(e) {
			console.error(e);
		}
		setMetricsLoading(false);
	}

	// TODO: obtain logs (ws)
	return(
		<Container className="svcs-container instance-detail-wrapper" fluid>
			<Card className="instance-detail-changelog">
				<CardHeader className="border-bottom">
					<div className="card-header-title">
						<i className="cil-description pr-2"></i>
						{t("ASABServices|Changelog")}
					</div>
				</CardHeader>
				<CardBody className="changelog-body">
					{changelogLoading ?
						<CellContentLoader cols={1} rows={20} />
					:
						<ReactMarkdown
							rehypePlugins={[rehypeRaw]}
							width="100%"
							height="100%"
							children={changelogContent}
						/>
					}
				</CardBody>
			</Card>
			<Card className="instance-detail-info">
				<CardHeader className="border-bottom">
					<div className="card-header-title">
						<i className="cil-info pr-2"></i>
						{instanceID ? instanceID : t("ASABServices|Info")}
					</div>
				</CardHeader>
				<CardBody className="h-100">
					{metricsLoading ?
						<CellContentLoader cols={1} rows={6} />
					:
						<div>Kde nic neni ani smrt nebere</div>
					}
				</CardBody>
			</Card>
			<Card className="instance-detail-terminal">
				<CardHeader className="border-bottom">
					<div className="card-header-title">
						<i className="cil-terminal pr-2"></i>
						{t("ASABServices|Terminal")}
					</div>
					<ButtonGroup>
						<ActionButton
							label={t("ASABServices|Start")}
							id={`start`}
							color="primary"
							icon="cil-media-play"
							// onClick={() => {setAction("start", data[objKey]?.instance_id), setIsSubmitting(true)}}
							// disabled={isSubmitting == true}
						/>
						<ActionButton
							label={t("ASABServices|Stop")}
							id={`stop`}
							color="primary"
							outline
							icon="cil-media-stop"
							// onClick={() => {setAction("stop", data[objKey]?.instance_id), setIsSubmitting(true)}}
							// disabled={isSubmitting == true}
						/>
						<ActionButton
							label={t("ASABServices|Restart")}
							id={`restart`}
							color="primary"
							outline
							icon="cil-reload"
							// onClick={() => {setAction("restart", data[objKey]?.instance_id), setIsSubmitting(true)}}
							// disabled={isSubmitting == true}
						/>
						<ActionButton
							label={t("ASABServices|Up")}
							id={`up`}
							color="primary"
							outline
							icon="cil-media-eject"
							// onClick={() => {setAction("up", data[objKey]?.instance_id), setIsSubmitting(true)}}
							// disabled={isSubmitting == true}
						/>
					</ButtonGroup>
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