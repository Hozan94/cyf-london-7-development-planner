import 'bootstrap/dist/css/bootstrap.css';
import { Tabs, Tab, TabContainer, Container, Row, Col } from 'react-bootstrap';
import SignUp from './SignUp/SignUp';
import Login from './Login/Login';
import "./Home.css"

function Home() {
    return (
        <Container>
            <Row>
                <Col md={{ span: 4, offset: 4 }}>
                    <Tabs defaultActiveKey="SignUp" id="uncontrolled-tab-example" className="mb-3 tabs-container">
                        <Tab eventKey="signUp" title="Signup" tabClassName="tab">
                            <SignUp />
                        </Tab>
                        <Tab eventKey="login" title="Login" tabClassName="tab">
                            <Login />
                        </Tab>
                    </Tabs>
                </Col>
            </Row>
        </Container>
    );
}

export default Home;
