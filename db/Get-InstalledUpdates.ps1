Function Get-InstalledUpdates {
    <#
    .SYNOPSIS
    Gets all Microsoft updates on the local machine and lists the KB, install date, and title.
    
    #>
    $UpdateSearcher = new-object -com "Microsoft.Update.Searcher"
    $TotalUpdates = $UpdateSearcher.GetTotalHistoryCount()
    $All = $UpdateSearcher.QueryHistory(0, $TotalUpdates)
    
    # Define a new array to gather output
    $OutputCollection = @()
    
    Foreach ($update in $All) {
        $KBTitle = $update.title
        $Regex = "KB\d*"
        $KB = ($KBTitle -match $Regex | Select-Object $Matches[0] | Get-Member)[-1]
        $output = New-Object -TypeName PSobject
        $output | add-member NoteProperty "HotFixID" -value $KB.Name
        $output | add-member NoteProperty "Title" -value $Update.Title
        $output | add-member NoteProperty "InstallDate" -value $Update.Date
        $OutputCollection += $output
    }
    
    Return $OutputCollection
    
}