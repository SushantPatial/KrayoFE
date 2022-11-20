import React, { useState, useEffect, useRef } from 'react';
import GoogleSignout from './GoogleSignout';
import './home.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PaperClipOutlined } from '@ant-design/icons';
import Loader from './Loader';

interface TableDataType {
  fileName: string;
  fileSize: string;
  fileLink: any;
}

const Home = () => {

  const [user, setUser] = useState({
    name: "",
    email: ""
  });
  const [file, setFile] = useState<any>();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<TableDataType[]>([]);
  const inputRef: any = useRef(null);

  const columns: ColumnsType<TableDataType> = [ {
    title: 'Name',
    dataIndex: 'fileName'
  }, {
    title: 'Size',
    dataIndex: 'fileSize',
    width: '120px'
  }, {
    title: 'Link',
    dataIndex: 'fileLink',
    width: '70px'
  }];

  let fetchUploads = async () => {
    setLoading(true);
    let email = localStorage.getItem('email');

    if (email === null) {
      toast.error("You are not logged in");
      setLoading(false);

    } else {
      
      axios.post('http://localhost:8000/api/fetchUploads', { email: email }, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then((response) => {
        if (response.data.result) {
          let uploads = response.data.data;
          const tempdata: TableDataType[] = [];

          uploads.forEach((upload: any) => {
            tempdata.push({
              fileName: upload.name,
              fileSize: upload.size + " MB",
              fileLink: <a href={upload.link} className='file-link'> 
                <PaperClipOutlined /> 
              </a>
            })
          })

          setData(tempdata);
        } else {
          toast.error("You are not logged in");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Couldn't fetch uploaded files");
        setLoading(false);
      });
    }
  }

  useEffect(() => {
    let name = localStorage.getItem('name');
    let email = localStorage.getItem('email');
    if (name != null && email != null) {
      setUser({
        name: name,
        email: email
      });
    } else {
      toast.error("You are not logged in");
    }
      
    fetchUploads();
  }, []);

  function handleChange(e: any) {
    setFile(e.target.files[0])
  }

  function handleSubmit(e :any) {
    e.preventDefault();

    if (!file) {
      toast.warning("Please choose a file to upload");

    } else {

      if (file.size > 10000000) {
        toast.error("Please select a file lesser than 10 MB");

      } else {
        let formData = new FormData();
        formData.append('fileName', file.name);
        formData.append("file", file);

        axios.post('http://localhost:8000/api/uploadFile', formData)
        .then((response) => {
          if (response.data.result) {
            setFile("");
            inputRef.current.value = null;

            setLoading(true);

            // console.log(response.data.data)
            // Saving file
            axios.post('http://localhost:8000/api/saveFile', {
              email: user.email,
              name: response.data.data.file.originalname,
              size: response.data.data.file.size,
              link: response.data.data.fileStream.Location
            }, {
              headers: {
                'Content-Type': 'application/json'
              }
            })
            .then((uploadData) => {
              if (uploadData.data.result) {
                let uploads = uploadData.data.data;
                const tempdata: TableDataType[] = [];
      
                uploads.forEach((upload: any) => {
                  tempdata.push({
                    fileName: upload.name,
                    fileSize: upload.size + " MB",
                    fileLink: <a href={upload.link} className='file-link'> 
                      <PaperClipOutlined /> 
                    </a>
                  })
                })
                
                setData(tempdata);
              } else {
                toast.error("You are not logged in");
              }

              setLoading(false);
            })
            .catch((err) => {
              console.log(err);
              toast.error("Couldn't fetch uploaded files");
              setLoading(false);
            })
            
            toast.success('File uploaded successfully!');
          }
        })
        .catch((err) => {
          console.log(err);
          toast.error("Couldn't upload file. Try again later");
        });
      }

    }
  }


  return (
    <div className='home'>
      <div className="left">

        <h1>Please Upload A File</h1>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="file-input">
              {file && file.name ? file.name : "Choose A File"}
            </label>

            <input id="file-input" type="file" ref={inputRef} onChange={handleChange} />
          </div>
              
          <button type="submit">Upload</button>
        </form>
      </div>

      <div className="right">
        <GoogleSignout />

        <h2>Welcome, {user.name}</h2>
        <h5>Here is the list of files you have uploaded</h5>
        {
          loading ? 
          <Loader /> : 
          // data.length > 0 ?
          <Table 
            columns={columns} 
            dataSource={data} 
            size="small"
            scroll={{ y: 300 }}
          /> 
          // "You do not have any uploads yet"
        }
      </div>
    </div>
  )
}

export default Home