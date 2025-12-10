"use client";

import React, { useState } from "react";
import { Container, Grid, Box, Button } from "@mui/material";
import TitleComponent from "@/app/components/title";
import { useTranslations } from "use-intl";

export default function UploadPriceDataPage() {
 const translations = useTranslations("UploadPriceData");
 const [file, setFile] = useState<File | null>(null);

 const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 const selected = e.target.files?.[0] || null;
 setFile(selected);
 };

 const onSubmit = (e: React.FormEvent) => {
 e.preventDefault();
 // For now, only UI; hook backend later
 if (!file) return;
 // TODO: Implement backend upload
 };

 return (
 <Container maxWidth="md">
 <Grid item>
 <TitleComponent title={translations("title")} />
 <Box component="form" onSubmit={onSubmit} sx={{ mt:2 }}>
 <input
 id="excel-upload"
 type="file"
 accept=".xlsx,.xls"
 onChange={onFileChange}
 />
 <Box sx={{ mt:2 }}>
 <Button type="submit" variant="contained" disabled={!file}>
 {translations("uploadButton")}
 </Button>
 </Box>
 </Box>
 </Grid>
 </Container>
 );
}
