import React,{useState} from 'react';
import { Button} from 'reactstrap';
import {Modals} from "./Modal";
import Axios from 'axios';


export const Table = () => {
    const [modal, setModal] = useState(false);
    const [modalKey, setModalKey] = useState(false);
    const [categoryText, setCategoryText] = useState("");
    const [keywordText, setKeywordText] = useState("");

    

    const [categories, setCategories] = useState([
        // { id: 0, name: "cars"},
        // { id: 1, name: "bikes"},
        // { id: 2, name: "fruit"}
    ]);

   

    const [keywords, setKeywords] = useState([
        // { id: 0, name: "audi", c_id: 0},
        // { id: 1, name: "bmw", c_id: 0},
        // { id: 2, name: "tires", c_id: 0},
        // { id: 3, name: "bianchi", c_id: 1},
        // { id: 4, name: "banana", c_id: 2},
        // { id: 5, name: "avocado", c_id: 2}
    ]);

    // useEffect(() => {
    //     console.log(keywords); 
    //     console.log(categories); 
    // }, [keywords, categories]);

    const fetchKeywords = async (text) =>{
        let c_id = categories.length;
        setCategories([...categories,{id: c_id, name: text}]);

        let k_id = keywords.length;
        const result = await Axios.get(`http://localhost:3004/${text}`);

            //         c_id: 3
            // score: 28491
            // tags: ["n"]
            // word: "ring"
        const newkeywords = result?.data.map(k => ({...k, c_id: c_id })) || [];
        const sortedKeywords = newkeywords.sort((a, b) => b.score - a.score)
                            .slice(0,10)
                            .map(({c_id, score, word}, i) => ({c_id, score, name: word, id: k_id + i}));

        setKeywords([...keywords, ...sortedKeywords]);
    }

    const addCategory = () => {
        setModal(!modal);
        if(categoryText){
            fetchKeywords(categoryText);
        }
        setCategoryText("");
    }

    const addKeyword = () => {
        setModalKey(!modalKey);
        if(keywordText){
             // { id: 5, name: "avocado", c_id: 2}
            // const newKeyword = {name: keywordText, id: keywords[keywords.length-1].id + 1, c_id: keywords[keywords.length-1].c_id };
			const newkw = {name: keywordText, score: keywords[keywords.length - 1].score + 5, c_id: keywords[keywords.length - 1].c_id, id: keywords[keywords.length - 1].id + 1  };
            
            setKeywords([...keywords, newkw]);
        }
        setKeywordText("");
    }

    const toggle = () =>{
        setModal(!modal);      
    }

    const toggleKeyword = () =>{
         setModalKey(!modalKey);      
    }

    const handleCategoryChange = (e) => {
        setCategoryText(e.target.value);
    }

    const handleKeywordChange = (e) => {
        setKeywordText(e.target.value);
    }

    const deleteKeyword = (id) => {
        setKeywords(keywords.filter(k=>k.id !== id))
    }

    const deleteCategory = (id) => {
        setCategories(categories.filter(c => c.id !== id ));
        setKeywords(keywords.filter(k=>k.c_id !== id))
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
                        <td>Arjun</td>
                        <td>KaranArjun, allu-arjun</td>
                    </tr>

                    {
                        categories.map(({id, name}) =>{
                            return(
                                <tr key={id}>
                                    <td>
                                        {name} <span className="fa fa-close cursor" onClick={()=>deleteCategory(id)}></span>
                                    </td>
                                    
                                    {
                                        <td>
                                           {
                                                keywords.filter(ke => (ke.c_id === id)).map(k => (
                                                    <button key={k.id} className="btn-keyword">
                                                        {k.name} <span className="fa fa-close cursor" onClick={() => deleteKeyword(k.id)}></span>
                                                    </button>
                                                ))
                                           }
                                           <button>
                                           <span className="fa fa-plus fa-7x" onClick={addKeyword}></span>
                                           </button>
                                        </td>
                                    }
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>

            <Button className="add-category" color="danger" onClick={toggle}>+Add category</Button>

            {/* toggle, 
            categoryText,
            addCategory,
            handleCategoryChange,
            header="Add a category",
            label="Add category" */}
            <Modals modal={modal}
                    toggle={toggle}
                    text={categoryText}
                    addText={addCategory}
                    handleChange={handleCategoryChange}
                    header="Add a category"
                    label="Add category" />
            
            {/* add keywords modal */}
            <Modals modal={modalKey}
                    toggle={toggleKeyword}
                    text={keywordText}
                    addText={addKeyword}
                    handleChange={handleKeywordChange}
                    header="Add Keyword"
                    label="Add a keyword" />
        </div>
    )
}
