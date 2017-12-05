/*
	@license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt
	
	Copyright (C) 2017 SabineWren
	https://github.com/SabineWren
	
	GNU AFFERO GENERAL PUBLIC LICENSE Version 3, 19 November 2007
	https://www.gnu.org/licenses/agpl-3.0.html
	
	@license-end
*/
package main

import   "io"
import   "net/http"
import   "os"

func DownloadIcon(sid string, iconUrl string) error {
	
	pathToNewImages, err := os.Getwd()
	if err != nil {
		return err
	}
	pathToNewImages += "/../../org_icons_new/"
	
	var resp *http.Response
	resp, err = http.Get(iconUrl)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	
	var filepath string = pathToNewImages + sid
	var imageFile *os.File
	imageFile, err = os.Create(filepath)
	if err != nil {
		return err
	}
	defer imageFile.Close()
	
	_, err = io.Copy(imageFile, resp.Body)
	if err != nil {
		return err
	}
	
	return nil
}
