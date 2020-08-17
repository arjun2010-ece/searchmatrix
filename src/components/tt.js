import React,{useState, Fragment} from 'react';
import axios from 'axios';

export const Table = () => {
    const [categoryFlag, setCategoryFlag] = useState(false);
    const [cursorFlag, setCursorFlag] = useState(false);
    const [categoryText, setCategoryText] = useState("");
    const [keywords, setKeywords] = useState([]);
    const [categCount, setCategCount] = useState([]);

    // useEffect(() => {
    //     async function fetchData() {
    //         const result = await axios(
    //             `https://api.datamuse.com/words?ml=${categoryText}`
    //           );
    //         const keywords = result.data
    //         const totalScore = keywords.map(el => {
    //             return el.score;
    //         })
    //         totalScore.sort(function(a, b) {
    //             return b - a;
    //         });

    //         const keywordsWords = totalScore.slice(0, 10).map(el => {
    //             return (keywords.map(kw => {
    //                 if(el === kw.score){
    //                     return kw.word;
    //                 }
    //             })).filter(word => {
    //                 return word !== undefined
    //             });
    //         });
    //         const flattenKeywords = keywordsWords.flat();
    //         localStorage.setItem("kw", flattenKeywords);
    //         setKeywords(flattenKeywords);
    //     }

    //     if(cursorFlag){
    //         fetchData();
    //     }
        
    // }, [cursorFlag]);

    async function fetchData(index) {
        const result = await axios(
            `https://api.datamuse.com/words?ml=${categCount[index].category}`
          );
        const keywords = result.data
        const totalScore = keywords.map(el => {
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
        const flattenKeywords = keywordsWords.flat();
        console.log(categCount);
        categCount[index].keywords = flattenKeywords;

        setCategCount(categCount);
        setKeywords(flattenKeywords);
    }

    // const handleKeywds = () => {

    //     setCursorFlag()
    // }

    const handleDelete = (index) => {
        const kws = keywords.filter((el, i) => i !== index);
        setKeywords(kws);
    }

    const handleChange = (e) => {
        setCategoryText(e.target.value);
    }

    const handleCategory = () => {
        categCount.push({ id: categCount.length, category:"", keywords:[]});
        console.log("Push..", categCount);
        setCursorFlag(false);
        setCategCount(categCount);
        setCategoryFlag(true);
    }

    const handleCheck = () => {
        setCursorFlag(true);
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
                    <td>Alfreds Futterkiste</td>
                    <td>Maria Anders</td>
                </tr>
                {
                    categCount.map((el, i) => {
                return (<tr key={i}>
                    {
                        categoryFlag ? <Fragment>
                        <td> 
                            <div id="input-container">
                                
                                {
                                    cursorFlag ? <span>
                                        {el.category}
                                    </span> :(
                                        <Fragment>
                                            <input type="text" className="category_input" onChange={(e) => {
                                                categCount[i].category = e.target.value;
                                                setCategCount(categCount);
                                            }} />
                                            <span className="fa fa-check cursor" onClick={(e) => {
                                                setCursorFlag(true);
                                                fetchData(i);
                                            }}></span>
                                            <span className="fa fa-close cursor"></span>
                                        </Fragment>
                                    )
                                }
                            </div>
                        </td>

                        <td>
                            {
                            Array.isArray(keywords) && keywords.length > 0 &&
                            keywords.map((kw, i) => {
                                return(
                                <button key={i} className="btn-keyword">
                                    {kw} <span className="fa fa-close cursor" onClick={()=>handleDelete(i)}></span>
                                </button>
                                )
                            })
                        
                        }
                        </td>
                        </Fragment> : null
                    }
                </tr>
                )
                })
                }
                </tbody>

                
            </table>
            <button className="add-category" onClick={handleCategory}>+Add categories</button>
    </div>
    )
}

