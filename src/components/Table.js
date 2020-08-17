import React,{useState, useEffect} from 'react';
import { Modal, Button } from 'antd';
import axios from 'axios';

export const Table = () => {
    const [visible, setVisible] = useState(false);
    const [text, setText] = useState("");
    const [categCount, setCategCount] = useState([]);
    const [keywords, setKeywords] = useState([]);
    const [okflag, setOkflag] = useState(false);

    useEffect(() => {
        console.log("ok flag ", okflag);
        console.log("categCount", categCount);
        console.log("keywords", keywords);
        console.log("text", text);
        console.log("visible", visible);
        if(okflag && keywords.length > 0 && visible){
            console.log("keywords...", keywords);
            console.log("text...", text);
            categCount.push({ id: categCount.length, category: text, keywords: keywords});
            setCategCount(categCount);
        }
    }, [okflag, keywords, visible, text])

    const showModal = () => {
        setVisible(true);
        setOkflag(true);
        // categCount.push({ id: categCount.length, category:"", keywords:[]});
        // setCategCount(categCount);
        // setText("");

    };

    async function fetchData(data) {

        const result = await axios(
            `http://localhost:3004/${data}`
          );
        const keywords = result && result.data;
        setOkflag(false);
        let totalScore = keywords && keywords.map(el => {
            return el.score;
        })
        totalScore.sort(function(a, b) {
            return b - a;
        });
        const keywordsWords = totalScore.slice(0, 10).map(el => {
            return (keywords.map(kw => {
                if(el === kw.score){
                    return kw.word;
                }
            })).filter(word => {
                return word !== undefined
            });
        });
        const flattenKeywords = [...new Set(keywordsWords.flat())];
        setKeywords(flattenKeywords);
        setOkflag(true);
        setText(data);
    }


    const handleOk = e => {
        fetchData(text);
        setVisible(false);
        // setOkflag(true);
        // console.log("Comming...");
        // console.log(keywords);
        // categCount.push({ id: categCount.length, category: text, keywords: keywords});
        // setCategCount(categCount);
        // setText("");
    };

    const handleChange = (e) => {
        setText(e.target.value);
    }

    const handleCancel = e => {
        setVisible(false);
      };
    //   console.log("categ count :", categCount);

    const handleDelete = () => {
        console.log("AJJAJ");
    }
    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Categories</th>
                        <th>Keywords</th>
                    </tr>
               
                </thead>

                <tbody>
                    <tr>
                        <td>Arjun category</td>
                        <td>Keywords in array</td>
                    </tr>

                    {
                        categCount.map((el, i) => (
                        <tr key={i}>
                            <td>{el.category}</td>

                            <td>
                                {
                                    Array.isArray(el.keywords) && el.keywords.map((el, i) => (
                                        <button key={i} className="btn-keyword">
                                            {el} <span className="fa fa-close cursor" onClick={()=>handleDelete(i)}></span>
                                        </button>
                                    ))
                                }
                            </td>
                        </tr>
                        ))
                    }
                </tbody>
            </table>

            <Button type="primary" onClick={showModal}>
                +Add category
            </Button>

            <Modal
                title=""
                visible={visible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <label htmlFor="category"> Please enter the category:{" "}
                    <input type="text" id="category" name="category" onChange={handleChange} />
                </label>
            </Modal>
        </div>
    )
}
