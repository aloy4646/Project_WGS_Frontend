import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Container, Grid, Paper, Typography, Divider, Box, Button } from '@mui/material'
import { format, toZonedTime } from 'date-fns-tz'

function formatDateToWIB(dateString) {
  
  const date = new Date(dateString)
  const timeZone = 'Asia/Jakarta'
  const zonedDate = toZonedTime(date, timeZone)
  return format(zonedDate, 'yyyy-MM-dd', { timeZone })
}

function isFilePath(value) {
  return typeof value === 'string' && value.includes('\\')
}

function DetailUpdateRequest() {
  let navigate = useNavigate()
  const { update_requestId } = useParams()
  const [detailUpdateRequest, setDetailUpdateRequest] = useState({})
  const [fileUrls, setFileUrls] = useState({})

  useEffect(() => {
    axios
      .get(`http://localhost:3001/admin/update-request/${update_requestId}`)
      .then((response) => {
        setDetailUpdateRequest(response.data.update_request)
      })
  }, [update_requestId])

  //meminta data berupa file ke server
  useEffect(() => {
    const fetchFiles = async (data, type) => {
      const urls = {}
      //mengecek semua data update-request apakah ada yang berupa file path
      for (const key in data) {
        if (isFilePath(data[key])) {
          //jika ada maka data file akan diminta ke server
          const response = await axios.get(
            `http://localhost:3001/file?filePath=${encodeURIComponent(
              data[key]
            )}`,
            {
              responseType: 'blob',
            }
          )
          const blob = new Blob([response.data], {
            type: response.headers['content-type'],
          })
          const url = URL.createObjectURL(blob)
          urls[key] = { url, type: response.headers['content-type'] }
        }
      }
      return urls
    }

    const fetchData = async () => {
      const oldUrls = await fetchFiles(detailUpdateRequest.old || {}, 'old')
      const newUrls = await fetchFiles(detailUpdateRequest.new || {}, 'new')
      setFileUrls({ old: oldUrls, new: newUrls })
    }

    if (detailUpdateRequest.old || detailUpdateRequest.new) {
      fetchData()
    }
  }, [detailUpdateRequest])

  const renderFile = (file) => {
    if (file.type.includes('pdf')) {
      return (
        <iframe src={file.url} width="100%" height="400px" title="PDF File" />
      )
    } else if (file.type.includes('image')) {
      return <img src={file.url} alt={file.name} style={{ maxWidth: '100%' }} />
    } else {
      return (
        <a href={file.url} target="_blank" rel="noopener noreferrer">
          Download File
        </a>
      )
    }
  }

  const handleAccept = () => {
    axios
      .put(
        `http://localhost:3001/admin/update-request/accept/${update_requestId}`,
        {
          // body
          idAdmin: 6,
        }
      )
      .then(() => {
        alert('Update Request Accepted')
        navigate(`/karyawan/update-request`)
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  }

  const handleReject = () => {
    axios
      .put(
        `http://localhost:3001/admin/update-request/reject/${update_requestId}`,
        {
          // body
          idAdmin: 6,
          alasan: 'file tidak sesuai',
        }
      )
      .then(() => {
        alert('Update Request Rejected')
        navigate(`/karyawan/update-request`)
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  }

  const renderDetails = (data, type) => {

    return Object.keys(data).map((key) => (
      <Box key={key} mb={2}>
        <Typography variant="subtitle1">
          {key.replace('_', ' ').toUpperCase()}:
        </Typography>
        {fileUrls[type] && fileUrls[type][key] ? (
          renderFile(fileUrls[type][key])
        ) : data[key] ? (
          <Typography>{data[key]}</Typography>
        ) : (
          <Typography variant="body2" color="textSecondary">
            No data
          </Typography>
        )}
        <Divider sx={{ my: 2 }} />
      </Box>
    ))
  }

  if (!detailUpdateRequest.id) {
    return <Typography>Loading...</Typography>
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Detail Update Request
      </Typography>
      <Grid item xs={12}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAccept}
          sx={{ marginRight: 1 }}
        >
          Accept
        </Button>
        <Button variant="contained" color="error" onClick={handleReject}>
          Reject
        </Button>
      </Grid>
      <Divider sx={{ my: 1 }} />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              ID User:
            </Typography>
            <Typography>{detailUpdateRequest.idUser}</Typography>
            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" gutterBottom>
              Nama Lengkap:
            </Typography>
            {detailUpdateRequest.nama_lengkap ? (
              <Typography>{detailUpdateRequest.nama_lengkap}</Typography>
            ) : (
              <Typography sx={{ fontStyle: 'italic', opacity: 0.8 }}>
                No Data
              </Typography>
            )}

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" gutterBottom>
              Date:
            </Typography>
            <Typography>{formatDateToWIB(detailUpdateRequest.date)}</Typography>
            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" gutterBottom>
              Message:
            </Typography>
            <Typography>{detailUpdateRequest.message}</Typography>
            <Divider sx={{ my: 2 }} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6" gutterBottom>
              Old Data
            </Typography>
            {renderDetails(detailUpdateRequest.old, 'old')}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6" gutterBottom>
              New Data
            </Typography>
            {renderDetails(detailUpdateRequest.new, 'new')}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default DetailUpdateRequest
