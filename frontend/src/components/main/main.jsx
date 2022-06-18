import React, { useState, useRef } from "react";
import { request, host } from "../../helpers/request";
import logo from '../../images/GitHub_Logo_White.png';
import { Helmet } from 'react-helmet';
import "./style.scss";

function Main() {
    const [link, setLink] = useState("");
    const [error, setError] = useState("");
    const inputLink = useRef(null);
    const [publicLink, setPublicLink] = useState(false);

    const copyToClipboard = () => {
        inputLink.current.select();
        document.execCommand("copy");
    };

    const submit = async (e) => {
        e.preventDefault();

        if (publicLink) {
            setLink("");
            setError("");
            setPublicLink(false);
            return;
        }

        if (link.length === 0) {
            setError("Please enter URL bellow");
            return;
        }

        const res = await request("makeShortLink", "POST", { link });

        if (res.success) {
            setPublicLink(true);
            setLink(res.link);
        }
        setError(res.error);
    };

    return (
        <div className="app-wrapper">
            <Helmet>
                <title>URL Shortener</title>
            </Helmet>
            <div className="main-page">
                <div className="info">
                    <p>Make any link shorter.</p> 
                    <p>Just try it!</p>
                </div>
                <div className="error-block">{error && <p>* {error}</p>}</div>
                <div className="form-block">
                    <form onSubmit={submit}>
                        <div className="form-group">
                            <input
                                ref={inputLink}
                                value={link}
                                onChange={(e) => {
                                    setLink(e.target.value);
                                    setError("");
                                }}
                                placeholder="Enter link"
                                readOnly={publicLink}
                            />
                            {publicLink && (
                                <button
                                    type="button"
                                    className="copy-button"
                                    onClick={(e) => copyToClipboard(e)}
                                >
                                    Copy
                                </button>
                            )}
                        </div>
                        <div className="form-group">
                            {!publicLink ? (
                                <button>Shorten</button>
                            ) : (
                                <button>Reset</button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
            <footer>
                <span>
                    Created by Andrey Rybakov 
                </span>
                <a href="https://github.com/bennibrovold">
                    <img src={logo} />
                </a>
            </footer>
        </div>
    );
}

export default Main;
