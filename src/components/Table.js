import React,{useState} from 'react';
import { Modal, Button } from 'antd';
import axios from 'axios';

export const Table = () => {
    const [category, setCategory] = useState([
        // {id: 0, name: 'Arjun'}
    ]);
    const [keywords, setKeywords] = useState([
        // {id: 0, name: 'Keywords',categoryId: 0},
        // {id: 1, name: 'in',categoryId: 0},
        // {id: 3, name: 'array',categoryId: 0},
    ]);
    const [visible, setVisible] = useState(false);
    const [text, setText] = useState("");
    const [okflag, setOkflag] = useState(false); //remove

    const showModal = () => {
        setVisible(true);
        setOkflag(true);
    };

    async function fetchData(data) {
        const cat_id = category.length
        setCategory([...category,{id: cat_id, name: data}])        
        setOkflag(false);
        const result = await axios(`http://localhost:3004/${data}`);
        const newKeywords = result?.data.map(d=>({...d,categoryId:cat_id})) || [];
        const key_id = keywords.length
        const sortedKeywords = newKeywords
            .sort((a,b)=>b.score-a.score)
            .slice(0, 10)
            .map(({word,score,categoryId},i)=>({name:word,score,categoryId,id:key_id+i}))
        
        setKeywords([...keywords,...sortedKeywords]);
        setText('');
        setOkflag(true);
    }


    const handleOk = e => {
        fetchData(text);
        setVisible(false);
    };

    const handleChange = (e) => {
        setText(e.target.value);
    }

    const handleCancel = e => {
        setVisible(false);
      };

    const handleKeywordDelete = (id) => {
        setKeywords(keywords.filter(c=>c.id!==id))
    }
    const handleCategoryDelete = (id) => {
        setCategory(category.filter(c=>c.id!==id))
        setKeywords(keywords.filter(k=>k.categoryId!==id))
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
                    {category.map(({id, name}) => (
                    <tr key={id}>
                        <td>
                            <div>
                                {name}
                                <span className="fa fa-close cursor" onClick={()=>handleCategoryDelete(id)}></span>
                            </div>
                        </td>
                        <td>{keywords.filter(k=>k.categoryId===id).map(({id,name})=>(
                            <button key={id} className="btn-keyword">
                                {name} <span className="fa fa-close cursor" onClick={()=>handleKeywordDelete(id)}></span>
                            </button>
                        ))}</td>
                    </tr>
                    ))}
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
