var React = require('react');
var Layout = require('./layout');
var ReactToolbox = require('react-toolbox');
var Button = require('react-toolbox/lib/button');
// var Button = ReactToolbox.ReactToolbox

// Contrived example to show how one might use Flow type annotations


class Index extends React.Component {
    render() {
        return (
            <Layout title={this.props.title}>
                <h1>{this.props.title}</h1>
                <p>Welcome to {this.props.title}</p>
                <p>
                    I can count to 10:
                </p>
                <Button label="Hello World!" />
            </Layout>
        );
    }
}

Index.propTypes = {
    title: React.PropTypes.string
};

module.exports = Index;
