# Run on wsus server to generate a list of updates in CSV
# Then import the CSV in to MySql to seed the DB
$SecurityUpdatesCsvPath = "C:\scripts\SecurityUpdates_$(Get-Date -f "ddMMyyyy").csv"
$CriticalUpdatesCsvPath = "C:\scripts\CriticalUpdates_$(Get-Date -f "ddMMyyyy").csv"

$Products = @( "Windows 7", "Windows 10", "2008", "2012", "2016", "2019", "2010")


Function Get-LatestVersionOfUpdates() {
    $WsusServer = Get-WsusServer
    $AllUpdates = $WsusServer.GetUpdates()    
    # Get all non-superseded updates so we have the latest 
    $NotSuperseded = $AllUpdates | Where { $_.IsSuperseded -eq $False -And $_.IsDeclined -eq $False }
    Return $NotSuperseded
}

Function Get-UnapprovedUpdatesForType($TypeString) {
    $NotSuperseded = Get-LatestVersionOfUpdates
    Return $NotSuperseded.Where{ 
        $_.ProductTitles -Like "*$TypeString*" -And 
        $_.IsApproved -Eq $false -And 
        $_.State -NotLike "NotNeeded"
    } | Select-Object -Property Title, 
    Description, 
    MsrcSeverity, 
    @{Name = "KnowledgebaseArticles"; Expression = { 
            $_.KnowledgebaseArticles 
        } 
    }, 
    @{Name = "SecurityBulletins"; Expression = { 
            $_.SecurityBulletins 
        } 
    }, 
    @{ Name = "AdditionalInformationUrls"; Expression = { 
            $_.AdditionalInformationUrls 
        } 
    }, 
    IsApproved, 
    @{ Name = "ProductTitles"; Expression = { 
            $_.ProductTitles | 
            Where-Object { $_ -NotLike "*Vista*" -Or 
                $_ -NotLike "*XP*" -Or 
                $_ -NotLike "*2003*" -Or 
                $_ -NotLike "*2008*" } 
        } 
    }, 
    State | 
    Sort-Object -Property $_.KnowledgebaseArticles |
    Get-Unique -AsString

}


$Office2010 = Get-UnapprovedUpdatesForType "2010"
$Office2010 | Export-Csv -NoTypeInformation -Path "C:\Scripts\O2010.csv"

$Windows7 = Get-UnapprovedUpdatesForType "Windows 7"
$Office2010 | Export-Csv -NoTypeInformation -Path "C:\Scripts\Win7.csv"

$Windows10 = Get-UnapprovedUpdatesForType "Windows 10"
$Windows10 | Export-Csv -NoTypeInformation -Path "C:\Scripts\Win10.csv"