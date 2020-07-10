Import-Module SimplySql

Open-MysqlConnection -Server localhost -Database wsus_up -Credential (Get-Credential)

Function Insert-Product {
    param(
        [Parameter(Mandatory = $true)][string]$ProductName
    )
    Try {
        Invoke-SqlQuery -Query "INSERT INTO product (product) VALUES (@p)" -Parameters @{p = $ProductName } -ErrorVariable $Err
    }
    Catch {
        Out-Host -InputObject "There was an error inserting that in to the database: $Err"
    }
}

Function Get-Products {
    Try {
        Invoke-SqlQuery -Query "SELECT * FROM product" -ErrorVariable $Err
    }
    Catch {
        Out-Host -InputObject "There was an error inserting that in to the database: $Err"
    }
}

Function Start-NPM {
    <#
    .SYNOPSIS
    Short description
    
    .PARAMETER ProjectName
    Name of the project we're starting. Will also be used as the name of the job so we can identify it when it's running.

    .PARAMETER Path
    Path to the node projects folder. Default value is set to "C:\Documents\GitHub".
    
    .PARAMETER ScriptName
    The script name as set in the project's package.json. To be used with 'npm start <ScriptName>'.
    
    .EXAMPLE
    Start-Npm -ProjectName WSUS_UP -ScriptName test # will start 'npm run test' in the WSUS_UP project directory
    
    #>
    [CmdletBinding()]
    param(
        [Parameter(Mandatory = $true)][string]$ProjectName,
        [Parameter(Mandatory = $false)][string]$Path = 'C:\documents\GitHub',
        [Parameter(Mandatory = $true)][string]$ScriptName
    )
    Begin {
        $Proceed = $False
        If (!(Get-Job -Name $ProjectName -ErrorAction 0 | Out-Null)) {
            $Proceed = $True    
        }
    }
    Process {
        if ($Proceed) {
            Try {
                Write-Progress "Starting job: $ProjectName"
                Start-Job -Name $ProjectName -WorkingDirectory "$Path\$ProjectName" -ScriptBlock { npm run $args } -ArgumentList $ScriptName
                Write-Host "Started Job $ProjectName."
            }
            Catch {
                Write-Progress "Unable to start $ProjectName."
            }
        }
    }
}

Function Stop-NPM {
    <#
    .SYNOPSIS
    Short description
    
    .PARAMETER ProjectName
    Name of the project we're stopping.
    
    .EXAMPLE
    Stop-Npm -ProjectName WSUS_UP 
    
    #>
    [CmdletBinding()]
    param(
        [Parameter(Mandatory = $true)][string]$ProjectName
    )
    Begin {
        $Proceed = $False
        If (!(Get-Job -Name $ProjectName -ErrorAction 0 | Out-Null)) {
            $Proceed = $True    
        }
    }
    Process {
        if ($Proceed) {
            Try {
                Get-Job -Name $ProjectName | Stop-Job 
                Get-Job -Name $ProjectName | Remove-Job 
                Write-Host "Stopped Job $ProjectName."
            }
            Catch {
                Write-Host "Unable to start $ProjectName."
            }
        }
    }
}