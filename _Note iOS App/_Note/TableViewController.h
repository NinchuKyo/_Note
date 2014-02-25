//
//  MasterViewController.h
//  _Note
//
//  Created by Lyndon Quigley on 2/4/2014.
//  Copyright (c) 2014 Lyndon Quigley. All rights reserved.
//

#import <UIKit/UIKit.h>

@class NoteEditorViewController;

@interface TableViewController : UITableViewController

@property (strong, nonatomic) NoteEditorViewController *noteEditorViewController;

@end
