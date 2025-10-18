import { Button } from "@material-tailwind/react";

import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";

interface HeaderProps {
  onImport: () => any[];
  onExport: () => void;
}

function Header({ onImport, onExport }: HeaderProps) {
  return (
    <div className="fixed top-0 left-0 !m-0 w-screen pointer-events-none">
      <div className="bg-gradient-to-b from-slate-300 to-slate-50">
        <div className="flex flex-row gap-2 justify-between">
          {/* <img className="select-none" src={logo} width="64px" height="64px" /> */}
          <div className="flex flex-row gap-2 pr-2 items-center pointer-events-auto">
            <Button
              className="flex flex-row p-2 gap-2 justify-between"
              type="button"
              variant="gradient"
              onClick={onImport}
            >
              <p>
                <strong>Import</strong>
              </p>
              <UploadFileRoundedIcon />
            </Button>
            <Button
              className="flex flex-row p-2 gap-2 justify-between"
              type="button"
              variant="gradient"
              onClick={onExport}
            >
              <p>
                <strong>Export</strong>
              </p>
              <FileDownloadOutlinedIcon />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
