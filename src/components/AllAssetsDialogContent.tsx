import { useAccounts } from "@/data/hooks"
import { AllAssets } from "./AllAssets"
import { Button } from "./ui/button"
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog"
import { Input } from "./ui/input"
import { Label } from "./ui/label"


export function AllAssetsDialogContent(props: {
  sectionId: string
}) {
  const { sectionId } = props
  const { data: accounts, isFetching, isLoading } = useAccounts(sectionId)
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>투자 자산을 선택하세요</DialogTitle>
        <DialogDescription>
          {`투자 자산 또는 투자 자산이 들어있는 "거래처 관리 항목" 자산을 선택하세요.`}
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        {isLoading && <div>loading...</div>}
        {accounts?.assets && <AllAssets sectionId={sectionId} assets={accounts.assets} />}
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button">
            닫기
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>



  )
}

