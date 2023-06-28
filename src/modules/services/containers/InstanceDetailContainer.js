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
import { IsJsonString } from "./components/IsJsonString";

export default function InstanceDetailContainer(props) {
	const { t } = useTranslation();
	const location = useLocation();

	const theme = useSelector(state => state.theme);

	const [ consoleContent, setConsoleConent ] = useState([]);
	const [ changelogContent, setChangelogConent ] = useState("");
	const [ changelogLoading, setChangelogLoading ] = useState(true);
	const [ metricsLoading, setMetricsLoading ] = useState(true);
	const [ detailLoading, setDetailLoading] = useState(true);

	const [ detailWSData, setDetailWSData ] = useState({});
	const [ wsInstanceDetailSubPath, setWsInstanceDetailSubpath ] = useState(undefined);

	const [ governatorID, setGovernatorID ] = useState(undefined);
	const [ terminalArray, setTerminalArray] = useState([]);

	const serviceName = 'asab-remote-control';
	const ASABRemoteControlAPI = props.app.axiosCreate(serviceName);

	// Reference to the bottom of the terminal
	const scrollToBottomRef = useRef(null);

	/* WS for detail info of the instance */
	let WSInstanceDetailUrl = undefined;
	let WSInstanceDetailClient = null;
	const isInstanceDetailMounted = useRef(null);

	// Auto scroll to the bottom of the terminal
	useEffect(() => {
		if (terminalArray?.length > 0) {
			scrollToBottomRef.current?.scrollIntoView({
				behavior: "smooth",
				block: "end"
			});
		}
	}, [terminalArray])

	// Connect to ws on page initialization, close ws connection on page leave
	useEffect(() => {
		if (wsInstanceDetailSubPath != undefined) {
			WSInstanceDetailUrl = props.app.getWebSocketURL(serviceName, wsInstanceDetailSubPath);
			isInstanceDetailMounted.current = true;

			if (WSInstanceDetailUrl != undefined) {
				reconnectInstanceDetail();
			}
		}

		return () => {
			if (WSInstanceDetailClient != null) {
				try {
					WSInstanceDetailClient.close();
				} catch (e) {
					console.log("Ignored exception: ", e)
				}
			}

			isInstanceDetailMounted.current = false;
		}
	}, [wsInstanceDetailSubPath]);


	// Reconnect ws method
	const reconnectInstanceDetail = () => {
		if (WSInstanceDetailClient != null) {
			try {
				WSInstanceDetailClient.close();
			} catch (e) {
				console.log("Ignored exception: ", e)
			}
		}

		if (isInstanceDetailMounted.current === false) return;

		WSInstanceDetailClient = props.app.createWebSocket(serviceName, wsInstanceDetailSubPath);

		// TODO: remove onopen
		WSInstanceDetailClient.onopen = () => {
			console.log('ws instance detail connection open');
		}

		WSInstanceDetailClient.onmessage = (message) => {
			setDetailLoading(false);
			if (IsJsonString(message.data) == true) {
				let retrievedData = JSON.parse(message.data);
				if (retrievedData && Object.keys(retrievedData)) {
					// Set websocket data
					setDetailWSData(retrievedData);
				}
				// setError(false);
			} else {
				// setErrorMsg(t("ASABServices|Can't display data due to parsing error"));
				// setError(true);
				console.error("Can't display data due to parsing error");
			}
		};

		WSInstanceDetailClient.onerror = (error) => {
			setDetailLoading(false);
			// setErrorMsg(t("ASABServices|Can't establish websocket connection, data can't be loaded"));
			// setError(true);
			console.error("Can't establish websocket connection, data can't be loaded");
			setTimeout(() => {
				reconnectInstanceDetail();
			}, 3000, this);
		};
	}
	/* End of WS for detail info of the instance */


	/* WS for Terminal */
	let WSTerminalUrl = undefined;
	let WSTerminalClient = null;
	const isTerminalMounted = useRef(null);

	// Connect to ws on page initialization, close ws connection on page leave
	useEffect(() => {
		if (governatorID != undefined) {
			let WSTerminalUrl = props.app.getWebSocketURL(governatorID, `/${instanceID}/ws`);
			isTerminalMounted.current = true;

			if (WSTerminalUrl != undefined) {
				reconnectTerminal();
			}
		}

		return () => {
			if (WSTerminalClient != null) {
				try {
					WSTerminalClient.close();
				} catch (e) {
					console.log("Ignored exception: ", e)
				}
			}

			isTerminalMounted.current = false;
		}
	}, [governatorID]);


	// Reconnect ws method
	const reconnectTerminal = () => {
		if (WSTerminalClient != null) {
			try {
				WSTerminalClient.close();
			} catch (e) {
				console.log("Ignored exception: ", e)
			}
		}

		if (isTerminalMounted.current === false) return;

		WSTerminalClient = props.app.createWebSocket(governatorID, `/${instanceID}/ws`);

		// TODO: remove onopen
		WSTerminalClient.onopen = () => {
			console.log('ws terminal connection open');
		}

		WSTerminalClient.onmessage = (message) => {
			if (message.data) {
				setTerminalArray(prevArray => [...prevArray, message.data]);
			}
			// setDetailLoading(false);
			// if (IsJsonString(message.data) == true) {
			// 	let retrievedData = JSON.parse(message.data);
			// 	if (retrievedData && Object.keys(retrievedData)) {
			// 		console.log(retrievedData, "TERMINAL")
			// 		// Set websocket data
			// 		// setTerminalWSData({..., retrievedData});
			// 	}
			// 	// setError(false);
			// } else {
			// 	// setErrorMsg(t("ASABServices|Can't display data due to parsing error"));
			// 	// setError(true);
			// 	console.error("Can't display data due to parsing error");
			// }
		};

		WSTerminalClient.onerror = (error) => {
			// setDetailLoading(false);
			// setErrorMsg(t("ASABServices|Can't establish websocket connection, data can't be loaded"));
			// setError(true);
			console.error("Can't establish websocket connection, data can't be loaded");
			setTimeout(() => {
				reconnectTerminal();
			}, 3000, this);
		};
	}
	/* End of WS for terminal */

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
			setWsInstanceDetailSubpath(`/ws?instance_id=${instanceID}`);
			obtainChangelog();
			obtainMetrics();
			obtainGovernatorID();
		}
	}, [instanceID])


	const obtainGovernatorID = async () => {
		try {
			let response = await ASABRemoteControlAPI.get(`/governator/${instanceID}`);
			console.log(response.data, "AHOOOJ")
			setGovernatorID(response.data.data);
		} catch(e) {
			console.error(e);
		}
	}

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
			<Card className="instance-detail-info">
				<CardHeader className="border-bottom">
					<div className="card-header-title">
						<i className="cil-info pr-2"></i>
						{instanceID ? `${instanceID} ${t("ASABServices|Detail info")}` : t("ASABServices|Detail info")}
					</div>
				</CardHeader>
				<CardBody className="changelog-body">
					{metricsLoading ?
						<CellContentLoader cols={1} rows={6} />
					:
						<ReactJson
							src={detailWSData}
							name={false}
							collapsed={false}
							theme={(theme === 'dark') ? "chalk" : "rjv-default"}
						/>
					}
				</CardBody>
			</Card>
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
			<Card className="instance-detail-metrics">
				<CardHeader className="border-bottom">
					<div className="card-header-title">
						<i className="cil-speedometer pr-2"></i>
						{t("ASABServices|Metrics")}
					</div>
				</CardHeader>
				<CardBody className="h-100">
					{metricsLoading ?
						<CellContentLoader cols={1} rows={6} />
					:
						<div>Kde nic neni ani metriky nebudou</div>
					}
				</CardBody>
			</Card>
			<Card className="instance-detail-terminal">
				<CardHeader className="border-bottom">
					<div className="card-header-title">
						<i className="cil-terminal pr-2"></i>
						{t("ASABServices|Terminal")}
					</div>
					{/*TODO: Remove action buttons if not needed<ButtonGroup>
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
					</ButtonGroup>*/}
				</CardHeader>
				<CardBody className="log-console">
					<Table className="mb-0" size="sm" borderless>
						{/*TODO: add auto scroll to the bottom*/}
						<tbody className="text-monospace console-body">
							{terminalArray.map((line, idx) => (
								<tr key={idx}>
									<td>{line}</td>
								</tr>
							))}
							{/*Empty line with reference to autoscroll to the bottom of the terminal*/}
							<tr ref={scrollToBottomRef}>
							</tr>
						</tbody>
					</Table>
				</CardBody>
			</Card>
		</Container>
	)
}