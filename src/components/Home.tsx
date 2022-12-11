import React, { useState, useEffect, useRef } from 'react';
import GoogleSignout from './GoogleSignout';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PaperClipOutlined } from '@ant-design/icons';
import Loader from './Loader';
const FileDownload = require('js-file-download');

interface TableDataType {
  fileName: string;
  fileSize: string;
  fileLink: any;
}

const Home:React.FC = () => {

  const [userName, setUserName] = useState<string>("");
  const [file, setFile] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<TableDataType[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const inputRef: any = useRef(null);

  const columns: ColumnsType<TableDataType> = [{
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

  /* ===== Fetch Uploads function ===== */
  let fetchUploads = async () => {
    setLoading(true);

    await axios.post(process.env.REACT_APP_BACKEND_URL + '/api/fetchUploads', {}, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('token')}`
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
              fileLink: <span className='file-link' onClick={() => downloadFile(upload.fileName)}>
                <PaperClipOutlined />
              </span>
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

  /* ===== Setting states on load ===== */
  useEffect(() => {
    let name = localStorage.getItem('name');
    if (name != null) {
      setUserName(name);
    } else {
      toast.error("You are not logged in");
    }

    fetchUploads();
  }, []);

  /* ===== Upload file input ===== */
  let handleChange = (e: any) => {
    setFile(e.target.files[0])
  }

  /* ===== Upload file button submit ===== */
  let handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!isUploading) {
      setIsUploading(true);

      if (!file) {
        toast.warning("Please choose a file to upload");
  
      } else {
  
        if (file.size > 10485760) { // 3145728 for production
          toast.error("Please select a file lesser than 10 MB");
  
        } else {
          let formData = new FormData();
          formData.append('fileName', file.name);
          formData.append("file", file);
  
  
          await axios.post(process.env.REACT_APP_BACKEND_URL + '/api/uploadFile', formData, {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem('token')}`
            }
          })
            .then((response) => {
  
              console.log(response);
  
              if (response.data.result) {
                setFile("");
                inputRef.current.value = null;
  
                fetchUploads();
  
                toast.success('File uploaded successfully!');
              }
            })
            .catch((err) => {
              console.log(err);
              toast.error("Couldn't upload file. Try again later");
            });
        }
      }

      setIsUploading(false);
    }
  }

  /* ===== Download file ===== */
  let downloadFile = async (fileName: string) => {
    await axios.get(process.env.REACT_APP_BACKEND_URL + '/api/downloadFile', { 
      params: {
        accessToken: localStorage.getItem('token'),
        fileName: fileName
      },
      responseType: 'blob'
    })
    .then((res) => {
      FileDownload(res.data, fileName.substring(14));
      toast.success('Your download has started');
    })
    .catch((err) => {
      console.log(err);
      toast.error("Couldn't download file. Try again later");
    })
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

          <button className='upload-btn' type="submit">
            {isUploading ? <div className="loader-small"></div> : "Upload"}
          </button>
        </form>
      </div>

      <div className="right">
        <GoogleSignout />

        <h2>Welcome, {userName}</h2>
        <h5>Here is the list of files you have uploaded</h5>
        {
          loading ?
            <Loader /> :
            <Table
              columns={columns}
              dataSource={data}
              size="small"
              pagination={false} 
              scroll={{ y: 300 }}
            />
        }
      </div>
    </div>
  )
}

export default Home