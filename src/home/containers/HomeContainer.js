import React from "react";
import { useTranslation } from 'react-i18next';

import {
	Container,
	Card,
	CardBody,
	Row, Col
} from "reactstrap";


function HomeContainer(props) {

	const homeScreenImg = props.app.Config.get('brand_image').full;
	const homeScreenAlt = props.app.Config.get('title');
	const { t, i18n } = useTranslation();

	return (
		<Container className="fadeIn home-container" fluid>
			<Card className="home-card h-100">
				<CardBody className="home-cardbody">
					<Row className="justify-content-center">
					<Col>
						<Row className="justify-content-center">
							<h3>{t("HomeContainer|Welcome to ASAB Services")}</h3>
						</Row>
						<Row className="justify-content-center">
							<img
								src={homeScreenImg}
								alt={homeScreenAlt}
								style={{maxWidth: "600px"}}
							/>
						</Row>
					</Col>
					</Row>
				</CardBody>
			</Card>
		</Container>
	);
}

export default HomeContainer;
